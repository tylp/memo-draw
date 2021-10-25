import { Socket } from 'socket.io';
import Room from '../classes/Room';
import RoomService from '../services/RoomService';
import SocketIdentifierService from '../services/SocketIdentifierService';

export default class RoomFacade {

	public static join(socket: Socket): boolean | Room {
		const joinedRoom = RoomService.join(SocketIdentifierService.getIdentifiersOf(socket));

		if (!joinedRoom) {
			return false;
		}

		socket.join(Room.getRoomName(joinedRoom.id));
		return this.reassignHost(socket);
	}

	public static reassignHost(socket: Socket): Room {
		const updatedRoom = RoomService.reassignHost(SocketIdentifierService.getIdentifiersOf(socket));
		socket.to(Room.getRoomName(updatedRoom.id)).emit('update-room', updatedRoom);
		return updatedRoom;
	}

	public static kick(socket: Socket, kickedPlayerId: string): Room {
		const updatedRoom = RoomService.kick(SocketIdentifierService.getIdentifiersOf(socket), kickedPlayerId);

		socket.to(Room.getRoomName(updatedRoom.id)).emit('update-room', updatedRoom);
		socket.to(Room.getRoomName(updatedRoom.id)).emit('kicked-player', kickedPlayerId);

		return updatedRoom;
	}

}
