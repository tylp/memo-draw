import { Socket } from 'socket.io';
import Room from '../Room';
import PlayerFactory from '../../factories/PlayerFactory';
import Application from '../Application';
import SocketBinder from './SocketBinder';
import SocketIdentifierService from '../../services/SocketIdentifierService';
import RoomFacade from '../../facades/RoomFacade';

export default class RoomSocketBinder extends SocketBinder {

	static bindSocket(socket: Socket): void {
		this.onJoinRoom(socket);
		this.onInvitedInRoom(socket);
		this.onKickPlayerFromRoom(socket);
		this.onDisconnection(socket);
		this.onGameStart(socket);
		this.onLeaveGame(socket);
	}

	private static onJoinRoom(socket: Socket): void {
		socket.on('join-room', (ack) => {
			ack(RoomFacade.join(socket));
		})
	}

	private static onInvitedInRoom(socket: Socket): void {
		socket.on('invited-in-room', (roomId, ack) => {
			if (Application.getRoomStorage().containsKey(roomId)) {
				Application.getPlayerRoomStorage().set(SocketIdentifierService.getSessionIdentifier(socket), roomId);
				ack(true);
			} else {
				ack(false);
			}
		})
	}

	private static onKickPlayerFromRoom(socket: Socket): void {
		socket.on('kick-player-from-room', (kickedPlayerId) => {
			RoomFacade.kick(socket, kickedPlayerId);
		})
	}

	private static onDisconnection(socket: Socket): void {
		const playerId = SocketIdentifierService.getPlayerIdentifier(socket);
		socket.on('disconnect', () => {
			const roomId = Application.getPlayerRoomStorage().get(SocketIdentifierService.getSessionIdentifier(socket));
			const room: Room = Application.getRoomStorage().removePlayer(roomId, playerId);
			if (room?.hostIs(playerId)) {
				room.assignRandomHost();
			}
			socket.to(Room.getRoomName(roomId)).emit('update-room', room);
		})
	}

	private static onGameStart(socket: Socket): void {
		socket.on('start-game', () => {
			const player = PlayerFactory.create(SocketIdentifierService.getSessionOf(socket));
			const roomId = Application.getPlayerRoomStorage().get(SocketIdentifierService.getSessionIdentifier(socket));
			const room = Application.getRoomStorage().get(roomId);
			if (room.hostPlayerId === player.id) {
				room.startGame();
				socket.emit('game-started', room, room.game);
				socket.to(Room.getRoomName(roomId)).emit('game-started', room, room.game);
			}
		})
	}

	private static onLeaveGame(socket: Socket): void {
		socket.on('leave-game', () => {
			RoomFacade.quit(socket)
		})
	}

}