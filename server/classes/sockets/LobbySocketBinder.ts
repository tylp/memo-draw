import { Socket } from 'socket.io';
import Lobby from '../Lobby';
import Application from '../Application';
import SocketBinder from './SocketBinder';
import SocketIdentifierService from '../../services/SocketIdentifierService';
import LobbyFacade from '../../facades/LobbyFacade';

export default class LobbySocketBinder extends SocketBinder {

	static bindSocket(socket: Socket): void {
		this.onJoinLobby(socket);
		this.onInvitedInLobby(socket);
		this.onKickPlayerFromLobby(socket);
		this.onDisconnection(socket);
		this.onGameStart(socket);
		this.onLeaveGame(socket);
	}

	private static onJoinLobby(socket: Socket): void {
		socket.on('join-room', (ack) => {
			ack(LobbyFacade.rejoin(socket));
		})
	}

	private static onInvitedInLobby(socket: Socket): void {
		socket.on('invited-in-room', (roomId, ack) => {
			if (Application.getLobbyStorage().containsKey(roomId)) {
				Application.getPlayerLobbyStorage().set(SocketIdentifierService.getSessionIdentifier(socket), roomId);
				ack(true);
			} else {
				ack(false);
			}
		})
	}

	private static onKickPlayerFromLobby(socket: Socket): void {
		socket.on('kick-player-from-room', (kickedPlayerId) => {
			LobbyFacade.kick(socket, kickedPlayerId);
		})
	}

	private static onDisconnection(socket: Socket): void {
		const playerId = SocketIdentifierService.getPlayerIdentifier(socket);
		socket.on('disconnect', () => {
			const roomId = Application.getPlayerLobbyStorage().get(SocketIdentifierService.getSessionIdentifier(socket));
			const room: Lobby = Application.getLobbyStorage().removePlayer(roomId, playerId);
			if (room?.hostIs(playerId)) {
				room.assignRandomHost();
			}
			socket.to(Lobby.getLobbyName(roomId)).emit('update-room', room);
		})
	}

	private static onGameStart(socket: Socket): void {
		socket.on('start-game', () => {
			LobbyFacade.startGame(socket);
		})
	}

	private static onLeaveGame(socket: Socket): void {
		socket.on('leave-game', () => {
			LobbyFacade.quit(socket)
		})
	}

}