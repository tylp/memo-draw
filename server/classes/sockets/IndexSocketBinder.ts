import { Socket } from 'socket.io';
import RoomFactory from '../../factories/RoomFactory';
import RoomService from '../../services/RoomService';
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
			RoomService.create(SocketIdentifierService.getIdentifiersOf(socket), ack);
		});
	}

	private static onCheckAlreadyInRoom(socket: Socket): void {
		socket.on('check-already-in-room', (ack) => {
			const sessionId = SocketIdentifierService.getSessionIdentifier(socket);
			const isAlreadyInRoom = Application.getPlayerRoomStorage().getRoomOf(sessionId);
			if (isAlreadyInRoom) {
				ack();
			}
		});
	}
}
