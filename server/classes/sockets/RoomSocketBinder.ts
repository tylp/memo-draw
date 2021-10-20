import { Socket } from 'socket.io';
import Room from '../Room';
import PlayerFactory from '../../factories/PlayerFactory';
import Application from '../Application';
import SocketBinder from './SocketBinder';
import SocketIdentifierService from '../../services/SocketIdentifierService';

export default class RoomSocketBinder extends SocketBinder {

	static bindSocket(socket: Socket): void {
		this.onJoinRoom(socket);
		this.onInvitedInRoom(socket);
		this.onKickPlayerFromRoom(socket);
		this.onResetLinkedRoom(socket);
		this.onDisconnection(socket);
		this.onGameStart(socket);
		this.onQuitGame(socket);
	}

	private static onJoinRoom(socket: Socket): void {
		socket.on('join-room', (ack) => {
			const sessionId = SocketIdentifierService.getSessionIdentifier(socket);
			const roomId = Application.getPlayerRoomStorage().get(sessionId);
			if (Application.getRoomStorage().containsKey(roomId)) {
				const session = Application.getSessionStorage().get(sessionId);
				Application.getPlayerRoomStorage().set(sessionId, roomId);
				socket.join(Room.getRoomName(roomId))
				const updatedRoom = Application.getRoomStorage().addPlayer(roomId, PlayerFactory.create(session));
				socket.to(Room.getRoomName(roomId)).emit('update-room', updatedRoom);
				ack(updatedRoom);
			} else {
				Application.getPlayerRoomStorage().delete(sessionId);
				ack(false);
			}
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
			const { sessionId, playerId } = SocketIdentifierService.getIdentifiersOf(socket);
			const currentPlayersRoom = Application.getPlayerRoomStorage().getRoomOf(sessionId);
			if (currentPlayersRoom.creatorIs(playerId)) {
				currentPlayersRoom.remove(kickedPlayerId);
				socket.to(Room.getRoomName(currentPlayersRoom.id)).emit('update-room', currentPlayersRoom);
				socket.to(Room.getRoomName(currentPlayersRoom.id)).emit('kicked-player', kickedPlayerId);
			}
		})
	}

	private static onResetLinkedRoom(socket: Socket): void {
		socket.on('reset-linked-room', () => {
			const sessionId = SocketIdentifierService.getSessionIdentifier(socket);
			Application.getPlayerRoomStorage().delete(sessionId);
		})
	}

	private static onDisconnection(socket: Socket): void {
		const playerId = SocketIdentifierService.getPlayerIdentifier(socket);
		socket.on('disconnect', () => {
			const roomId = Application.getPlayerRoomStorage().get(SocketIdentifierService.getSessionIdentifier(socket));
			const room: Room = Application.getRoomStorage().removePlayer(roomId, playerId);
			socket.to(Room.getRoomName(roomId)).emit('update-room', room);
		})
	}

	private static onGameStart(socket: Socket): void {
		socket.on('start-game', () => {
			const player = PlayerFactory.create(SocketIdentifierService.getSessionOf(socket));
			const roomId = Application.getPlayerRoomStorage().get(SocketIdentifierService.getSessionIdentifier(socket));
			const room = Application.getRoomStorage().get(roomId);
			if (room.creatorPlayerId === player.id) {
				room.startGame();
				socket.emit('game-started', room, room.game);
				socket.to(Room.getRoomName(roomId)).emit('game-started', room, room.game);
			}
		})
	}

	//TODO : Refactor by using service (in another issue)
	private static onQuitGame(socket: Socket): void {
		const playerId = SocketIdentifierService.getPlayerIdentifier(socket);
		socket.on('quit-game', () => {
				const roomId = Application.getPlayerRoomStorage().get(SocketIdentifierService.getSessionIdentifier(socket));
				const room: Room = Application.getRoomStorage().removePlayer(roomId, playerId);
				socket.to(Room.getRoomName(roomId)).emit('update-room', room);
		})
	}

}