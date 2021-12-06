import { GameModeProperty } from './../../enums/GameProperties';
import { Socket } from 'socket.io';
import Lobby from '../Lobby/Lobby';
import Application from '../Application';
import SocketBinder from './SocketBinder';
import SocketIdentifierService from '../../services/SocketIdentifierService';
import LobbyFacade from '../../facades/LobbyFacade';
import { Player } from '..';

export default class LobbySocketBinder extends SocketBinder {

	static bindSocket(socket: Socket): void {
		this.onJoinLobby(socket);
		this.onInvitedInLobby(socket);
		this.onKickPlayerFromLobby(socket);
		this.onDisconnection(socket);
		this.onGameStart(socket);
		this.onLeaveGame(socket);
		this.onStartVote(socket);
		this.onVote(socket);
		this.onUpdateGameMode(socket);
	}

	private static onJoinLobby(socket: Socket): void {
		socket.on('join-lobby', (ack) => {
			ack(LobbyFacade.rejoin(socket));
		})
	}

	private static onInvitedInLobby(socket: Socket): void {
		socket.on('invited-in-lobby', (lobbyId: Lobby['id'], ack) => {
			if (Application.getLobbyStorage().containsKey(lobbyId)) {
				Application.getPlayerLobbyStorage().set(SocketIdentifierService.getSessionIdentifier(socket), lobbyId);
				ack(true);
			} else {
				ack(false);
			}
		})
	}

	private static onKickPlayerFromLobby(socket: Socket): void {
		socket.on('kick-player-from-lobby', (kickedPlayerId) => {
			LobbyFacade.kick(socket, kickedPlayerId);
		})
	}

	private static onDisconnection(socket: Socket): void {
		const playerId = SocketIdentifierService.getPlayerIdentifier(socket);
		socket.on('disconnect', () => {
			const lobbyId = Application.getPlayerLobbyStorage().get(SocketIdentifierService.getSessionIdentifier(socket));
			const lobby: Lobby = Application.getLobbyStorage().removePlayer(lobbyId, playerId);
			if (lobby?.isPlayerHost(playerId)) {
				lobby.assignRandomHost();
			}
			socket.to(Lobby.getLobbyName(lobbyId)).emit('update-lobby', lobby);
		})
	}

	private static onGameStart(socket: Socket): void {
		socket.on('start-game', (gameModeProperty: GameModeProperty) => {
			LobbyFacade.startGame(socket, gameModeProperty);
		})
	}

	private static onLeaveGame(socket: Socket): void {
		socket.on('leave-lobby', () => {
			LobbyFacade.quit(socket)
		})
	}

	private static onStartVote(socket: Socket): void {
		socket.on('start-vote', (selectedPlayer: Player) => {
			LobbyFacade.startVote(socket, selectedPlayer);
		})
	}

	private static onVote(socket: Socket): void {
		socket.on('vote', (vote) => {
			LobbyFacade.vote(socket, vote);
		})
	}

	private static onUpdateGameMode(socket: Socket): void {
		socket.on('update-game-mode', (gameMode) => {
			LobbyFacade.updateGameMode(socket, gameMode);
		})
	}
}