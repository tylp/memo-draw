import { Socket } from 'socket.io';
import RoomFactory from '../../factories/RoomFactory';
import SocketIdentifierService from '../../services/SocketIdentifierService';
import Application from '../Application';
import SocketBinder from './SocketBinder';

export default class IndexSocketBinder extends SocketBinder {
	static bindSocket(socket: Socket): void {
		this.onRoomCreation(socket);
		this.onCheckAlreadyInRoom(socket);
	}

	private static onRoomCreation(socket: Socket): void {
		socket.on('create-room', (ack) => {
			const playerId = SocketIdentifierService.getPlayerIdentifier(socket);
			const sessionId = SocketIdentifierService.getSessionIdentifier(socket);
			const room = RoomFactory.create(playerId);
			Application.getPlayerRoomStorage().set(sessionId, room.id)
			Application.getSessionStorage().update(sessionId, { playerRoomId: room.id })
			ack();
		});
	}

	private static onCheckAlreadyInRoom(socket: Socket): void {
		socket.on('check-already-in-room', (ack) => {
			const sessionId = SocketIdentifierService.getSessionIdentifier(socket);
			ack(Application.getPlayerRoomStorage().getRoomOf(sessionId))
		});
	}
}
