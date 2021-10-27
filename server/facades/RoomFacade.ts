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
		const sessionOfSocket = SocketIdentifierService.getSessionOf(socket);
		const room = Application.getRoomStorage().get(roomId);
		const player = PlayerFactory.create(sessionOfSocket);

		room.add(player);
		socket.join(room.getSocketRoomName());
		RoomService.linkPlayerToRoom(sessionOfSocket.sessionId, room.id);

		return room;
	}

	public static rejoin(socket: Socket): Room {
		const joinedRoomId = Application.getPlayerRoomStorage().get(SocketIdentifierService.getSessionIdentifier(socket))

		if (joinedRoomId) {
			socket.join(Room.getRoomName(joinedRoomId));
		}

		return this.reassignHost(socket);
	}

	public static reassignHost(socket: Socket): Room {
		const updatedRoom = RoomService.reassignHost(SocketIdentifierService.getIdentifiersOf(socket));

		if (updatedRoom) {
			socket.to(Room.getRoomName(updatedRoom.id)).emit('update-room', updatedRoom);
		}

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
