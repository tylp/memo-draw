import { Socket } from 'socket.io';
import Room from '../Room';
import PlayerFactory from '../../factories/PlayerFactory';
import Application from '../Application';
import SocketBinder from './SocketBinder';
import SocketIdentifierService from '../../services/SocketIdentifierService';

export default class RoomSocketBinder extends SocketBinder {
	static bindSocket(socket: Socket): void {
		this.onJoinRoom(socket);
		this.onMessageRoom(socket);
		this.onDisconnection(socket);
		this.onGameStart(socket);
	}

	private static onJoinRoom(socket: Socket): void {        
		socket.on('join-room', (roomId, ack) => {
			if(Application.getRoomStorage().containsKey(roomId)) {
				const sessionId = SocketIdentifierService.getSessionIdentifier(socket);
				const session = Application.getSessionStorage().get(sessionId);
				Application.getPlayerRoomStorage().set(sessionId, roomId);
				socket.join(Room.getRoomName(roomId))
				const updatedRoom = Application.getRoomStorage().addPlayer(roomId, PlayerFactory.create(session));
				socket.to(Room.getRoomName(roomId)).emit('update-room', updatedRoom);
				ack(updatedRoom);
			} else {
				ack(false);
			}
		})
	}

	private static onMessageRoom(socket: Socket): void {
		const player = PlayerFactory.create(SocketIdentifierService.getSessionOf(socket));
		socket.on('send-message-room', (content: string, roomId: string) => {
			const trimmedContent = content.trim();
			if(Application.getRoomStorage().isPlayerPresent(roomId, player) && trimmedContent.length > 0) {
				socket.to(Room.getRoomName(roomId)).emit('receive-message-room', {
					username: player.profile.username,
					content: trimmedContent
				})
			}
		});
	}
    
	private static onDisconnection(socket: Socket): void {
		const player = PlayerFactory.create(SocketIdentifierService.getSessionOf(socket));
		socket.on('disconnect', () => {
			const roomId = Application.getPlayerRoomStorage().get(SocketIdentifierService.getSessionIdentifier(socket));
			const room: Room = Application.getRoomStorage().removePlayer(roomId, player);
			socket.to(Room.getRoomName(roomId)).emit('update-room', room);
		})
	}

	private static onGameStart(socket: Socket): void {
		socket.on('start-game', () => {
			const player = PlayerFactory.create(SocketIdentifierService.getSessionOf(socket));
			const roomId = Application.getPlayerRoomStorage().get(SocketIdentifierService.getSessionIdentifier(socket));
			const room = Application.getRoomStorage().get(roomId);
			if(room.creatorPlayerId === player.id) {
				room.startGame();
				socket.emit('game-started', room, room.game);
				socket.to(Room.getRoomName(roomId)).emit('game-started', room, room.game);
			}
		})
	}
}