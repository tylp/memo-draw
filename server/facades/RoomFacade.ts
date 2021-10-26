import { Socket } from 'socket.io';
import Application from '../classes/Application';
import Room from '../classes/Room';
import PlayerFactory from '../factories/PlayerFactory';
import RoomService from '../services/RoomService';
import SocketIdentifierService from '../services/SocketIdentifierService';

export default class RoomFacade {
	public static create(socket: Socket): Room {
		const room = RoomService.create(SocketIdentifierService.getIdentifiersOf(socket))

		return RoomFacade.join(socket, room.id);
	}

	public static join(socket: Socket, roomId: Room['id']): Room {
		const room = Application.getRoomStorage().get(roomId);
		const player = PlayerFactory.create(SocketIdentifierService.getSessionOf(socket));

		room.add(player);

		socket.join(room.getSocketRoomName());

		return room;
	}

	public static rejoin(socket: Socket): Room {
		const joinedRoom = RoomService.join(SocketIdentifierService.getIdentifiersOf(socket));

		if (!joinedRoom) {
			return joinedRoom;
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

	public static quit(socket: Socket): Room {
		const updatedRoom = RoomService.quit(SocketIdentifierService.getIdentifiersOf(socket))

		socket.to(Room.getRoomName(updatedRoom.id)).emit('update-room', updatedRoom);

		return updatedRoom;
	}

}
