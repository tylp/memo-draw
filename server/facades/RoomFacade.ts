import { Socket } from 'socket.io';
import Application from '../classes/Application';
import Room from '../classes/Room';
import RoomService from '../services/RoomService';
import SocketIdentifierService from '../services/SocketIdentifierService';

export default class RoomFacade {

	public static join(socket: Socket): Room {
		const joinedRoom = RoomService.join(SocketIdentifierService.getSessionIdentifier(socket));

		if (!joinedRoom) {
			return joinedRoom;
		}

		socket.join(Room.getRoomName(joinedRoom.id));
		return this.reassignHost(socket);
	}

	public static reassignHost(socket: Socket): Room {
		const updatedRoom = RoomService.reassignHost(SocketIdentifierService.getSessionIdentifier(socket));
		socket.to(Room.getRoomName(updatedRoom.id)).emit('update-room', updatedRoom);
		return updatedRoom;
	}

	public static kick(socket: Socket, kickedPlayerId: string): Room {
		const kickedSessionId = Application.getPlayerIdSessionIdStorage().get(kickedPlayerId)
		const updatedRoom = RoomService.kick(SocketIdentifierService.getSessionIdentifier(socket), kickedSessionId);

		socket.to(Room.getRoomName(updatedRoom.id)).emit('update-room', updatedRoom);
		socket.to(Room.getRoomName(updatedRoom.id)).emit('kicked-player', kickedPlayerId);

		return updatedRoom;
	}

	public static quit(socket: Socket): Room {
		const updatedRoom = RoomService.quit(SocketIdentifierService.getSessionIdentifier(socket))

		socket.to(Room.getRoomName(updatedRoom.id)).emit('update-room', updatedRoom);

		return updatedRoom;
	}

}
