import { Socket } from 'socket.io';
import Application from '../classes/Application';
import Lobby from '../classes/Lobby/Lobby';
import { YesOrNo } from '../classes/Votes/YesNoVote';
import PlayerFactory from '../factories/PlayerFactory';
import LobbyService from '../services/LobbyService';
import SocketIdentifierService from '../services/SocketIdentifierService';

export default class LobbyFacade {
	public static create(socket: Socket): Lobby {
		const lobby: Lobby = LobbyService.create(SocketIdentifierService.getIdentifiersOf(socket))

		LobbyFacade.join(socket, lobby.id);

		return lobby;
	}

	public static join(socket: Socket, lobbyId: Lobby['id']): Lobby {
		const sessionOfSocket = SocketIdentifierService.getSessionOf(socket);
		const lobby = Application.getLobbyStorage().get(lobbyId);
		const player = PlayerFactory.create(sessionOfSocket);

		lobby.add(player);
		socket.join(lobby.getSocketRoomName());
		LobbyService.linkPlayerToLobby(sessionOfSocket.sessionId, lobby.id);
		this.updateLobby(socket, lobby);

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
			this.updateLobby(socket, updatedLobby);
		}

		return updatedLobby;
	}

	private static updateLobby(socket: Socket, lobby: Lobby): void {
		socket.in(Lobby.getLobbyName(lobby.id)).emit('update-lobby', lobby);
		socket.to(socket.id).emit('update-lobby', lobby);
	}

	public static startGame(socket: Socket): void {
		const player = PlayerFactory.create(SocketIdentifierService.getSessionOf(socket));
		const lobbyId = Application.getPlayerLobbyStorage().get(SocketIdentifierService.getSessionIdentifier(socket));
		const lobby = Application.getLobbyStorage().get(lobbyId);

		if (LobbyService.start(lobby, player)) {
			socket.in(Lobby.getLobbyName(lobbyId)).emit('game-started', lobby);
		}
	}

	public static kick(socket: Socket, kickedPlayerId: string): Lobby {
		const updatedLobby = LobbyService.kick(SocketIdentifierService.getIdentifiersOf(socket), kickedPlayerId);

		this.updateLobby(socket, updatedLobby);
		socket.in(Lobby.getLobbyName(updatedLobby.id)).emit('kicked-player', kickedPlayerId);

		return updatedLobby;
	}

	public static quit(socket: Socket): Lobby {
		const updatedLobby = LobbyService.quit(SocketIdentifierService.getIdentifiersOf(socket))

		this.updateLobby(socket, updatedLobby);

		return updatedLobby;
	}

	public static startVote(socket: Socket, selectedDrawing: number): Lobby {
		const playerLobby = LobbyService.startVote(SocketIdentifierService.getIdentifiersOf(socket), selectedDrawing);

		Application.getSocketIoInstance().to(playerLobby.getSocketRoomName()).emit('start-vote', playerLobby);

		setTimeout(() => {
			playerLobby?.game.endVote();
			socket.in(playerLobby.getSocketRoomName()).emit('stop-vote', playerLobby);
		}, 10 * 1000)

		return playerLobby;
	}

	public static vote(socket: Socket, vote: YesOrNo): Lobby {
		const playerLobby = LobbyService.vote(SocketIdentifierService.getIdentifiersOf(socket), vote);

		this.updateLobby(socket, playerLobby);

		return playerLobby;
	}
}
