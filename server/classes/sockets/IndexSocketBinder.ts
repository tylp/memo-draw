import { Socket } from 'socket.io';
import RoomFacade from '../../facades/RoomFacade';
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
			ack(RoomFacade.create(socket));
		});
	}

	private static onCheckAlreadyInRoom(socket: Socket): void {
		socket.on('check-already-in-room', (ack) => {
			const sessionId = SocketIdentifierService.getSessionIdentifier(socket);
			ack(!!Application.getPlayerRoomStorage().getRoomOf(sessionId))
		});
	}
}
