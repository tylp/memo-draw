import { GameModeProperty } from './../enums/GameProperties';
import { Socket } from 'socket.io';
import Application from '../classes/Application';
import Lobby from '../classes/Lobby/Lobby';
import { YesOrNo } from '../classes/Votes/YesNoVote';
import PlayerFactory from '../factories/PlayerFactory';
import LobbyService from '../services/LobbyService';
import SocketIdentifierService from '../services/SocketIdentifierService';
import { Player } from '../classes';
import dayjs from 'dayjs';

export default class LobbyFacade {
	public static create(socket: Socket): Lobby {
		const lobby: Lobby = LobbyService.create(SocketIdentifierService.getIdentifiersOf(socket))

		LobbyFacade.join(socket, lobby.id);

		return lobby;
	}

	public static join(socket: Socket, lobbyId: Lobby['id']): Lobby {
		const sessionOfSocket = SocketIdentifierService.getSessionOf(socket);
		const lobby = Application.getLobbyStorage().get(lobbyId);
		if (!lobby) return;

		const player = PlayerFactory.create(sessionOfSocket);

		lobby.add(player);
		socket.join(lobby.getSocketRoomName());
		LobbyService.linkPlayerToLobby(sessionOfSocket.sessionId, lobby.id);
		socket.to(lobby.getSocketRoomName()).emit('update-lobby', lobby);

		return lobby;
	}

	public static rejoin(socket: Socket): Lobby {
		const joinedLobbyId = Application.getPlayerLobbyStorage().get(SocketIdentifierService.getSessionIdentifier(socket))

		if (joinedLobbyId) {
			socket.join(Lobby.getLobbyName(joinedLobbyId));
		}

		return this.reassignHost(socket);
	}

	public static reassignHost(socket: Socket): Lobby {
		const updatedLobby = LobbyService.reassignHost(SocketIdentifierService.getIdentifiersOf(socket));

		if (updatedLobby) {
			this.updateLobby(updatedLobby);
		}

		return updatedLobby;
	}

	private static emitToLobby(ev: string, lobby: Lobby, ...params: unknown[]): void {
		if (!lobby) return;
		params = params || [];
		Application.getSocketIoInstance()
			.of('/game')
			.to(lobby.getSocketRoomName())
			.emit(ev, ...params);
	}

	private static updateLobby(lobby: Lobby): void {
		LobbyFacade.emitToLobby('update-lobby', lobby, lobby);
	}

	public static startGame(socket: Socket, gameModeProperty: GameModeProperty): void {
		const player = PlayerFactory.create(SocketIdentifierService.getSessionOf(socket));
		const lobbyId = Application.getPlayerLobbyStorage().get(SocketIdentifierService.getSessionIdentifier(socket));
		const lobby = Application.getLobbyStorage().get(lobbyId);

		if (LobbyService.start(lobby, player, gameModeProperty)) {
			socket.in(Lobby.getLobbyName(lobbyId)).emit('game-started', lobby);
			setTimeout(() => {
				socket.in(lobby.getSocketRoomName()).emit('next-drawing')
			}, lobby?.game?.limitDate.diff(dayjs(), 'milliseconds'))
		}
	}

	public static kick(socket: Socket, kickedPlayerId: string): Lobby {
		const updatedLobby = LobbyService.kick(SocketIdentifierService.getIdentifiersOf(socket), kickedPlayerId);

		this.updateLobby(updatedLobby);
		socket.in(Lobby.getLobbyName(updatedLobby.id)).emit('kicked-player', kickedPlayerId);

		return updatedLobby;
	}

	public static quit(socket: Socket): Lobby {
		const updatedLobby = LobbyService.quit(SocketIdentifierService.getIdentifiersOf(socket))

		this.updateLobby(updatedLobby);

		return updatedLobby;
	}

	public static startVote(socket: Socket, selectedPlayer: Player): Lobby {
		const playerLobby = LobbyService.startVote(SocketIdentifierService.getIdentifiersOf(socket), selectedPlayer);

		this.emitToLobby('vote-started', playerLobby, playerLobby);

		setTimeout(() => {
			if (!playerLobby) return;
			playerLobby?.game.endVote();
			Application.getSocketIoInstance().of('/game').to(playerLobby.getSocketRoomName()).emit('stop-vote', playerLobby);
		}, playerLobby?.game?.playerErrorVoteManager.getVoteEndDate().diff(dayjs(), 'milliseconds'));

		return playerLobby;
	}

	public static vote(socket: Socket, vote: YesOrNo): Lobby {
		const playerLobby = LobbyService.vote(SocketIdentifierService.getIdentifiersOf(socket), vote);

		this.updateLobby(playerLobby);

		return playerLobby;
	}

	public static playAgain(socket: Socket): void {
		const lobby = LobbyService.playAgain(SocketIdentifierService.getIdentifiersOf(socket));

		this.updateLobby(lobby);
	}

	public static updateGameMode(socket: Socket, gameMode: GameModeProperty): void {
		const player = PlayerFactory.create(SocketIdentifierService.getSessionOf(socket));
		const lobbyId = Application.getPlayerLobbyStorage().get(SocketIdentifierService.getSessionIdentifier(socket));
		const lobby = Application.getLobbyStorage().get(lobbyId);

		if (lobby.isPlayerHost(player.id)) {
			socket.in(Lobby.getLobbyName(lobbyId)).emit('update-game-mode', gameMode);
		}
	}
}
