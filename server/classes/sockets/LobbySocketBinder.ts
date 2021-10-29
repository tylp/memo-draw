import { Socket } from 'socket.io';
import Room from '../Room';
import Application from '../Application';
import SocketBinder from './SocketBinder';
import SocketIdentifierService from '../../services/SocketIdentifierService';
import LobbyFacade from '../../facades/LobbyFacade';

export default class LobbySocketBinder extends SocketBinder {

	static bindSocket(socket: Socket): void {
		this.onJoinLobby(socket);
		this.onInvitedInRoom(socket);
		this.onKickPlayerFromRoom(socket);
		this.onDisconnection(socket);
		this.onGameStart(socket);
		this.onLeaveGame(socket);
	}

	private static onJoinLobby(socket: Socket): void {
		socket.on('join-room', (ack) => {
			ack(LobbyFacade.rejoin(socket));
		})
	}

	private static onInvitedInRoom(socket: Socket): void {
		socket.on('invited-in-room', (roomId, ack) => {
			if (Application.getLobbyStorage().containsKey(roomId)) {
				Application.getPlayerLobbyStorage().set(SocketIdentifierService.getSessionIdentifier(socket), roomId);
				ack(true);
			} else {
				ack(false);
			}
		})
	}

	private static onKickPlayerFromRoom(socket: Socket): void {
		socket.on('kick-player-from-room', (kickedPlayerId) => {
			LobbyFacade.kick(socket, kickedPlayerId);
		})
	}

	private static onDisconnection(socket: Socket): void {
		const playerId = SocketIdentifierService.getPlayerIdentifier(socket);
		socket.on('disconnect', () => {
			const roomId = Application.getPlayerLobbyStorage().get(SocketIdentifierService.getSessionIdentifier(socket));
			const room: Room = Application.getLobbyStorage().removePlayer(roomId, playerId);
			if (room?.hostIs(playerId)) {
				room.assignRandomHost();
			}
			socket.to(Room.getRoomName(roomId)).emit('update-room', room);
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