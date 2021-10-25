import Application from '../classes/Application';
import Room from '../classes/Room';
import PlayerFactory from '../factories/PlayerFactory';
import RoomFactory from '../factories/RoomFactory';

interface PlayerIdentifiers {
	playerId: string;
	sessionId: string;
}

export default class RoomService {
	
	public static create({ playerId, sessionId }: PlayerIdentifiers, ack: any): void {
		const room = RoomFactory.create(playerId);
		Application.getPlayerRoomStorage().set(sessionId, room.id)
		Application.getSessionStorage().update(sessionId, { playerRoomId: room.id })
		ack();
	}

	public static join({ sessionId }: PlayerIdentifiers): Room {
		const roomId = Application.getPlayerRoomStorage().get(sessionId);

		if (this.roomExists(roomId)) {
			return this.setLinkedRoom(sessionId, roomId);
		} else {
			return this.removeLinkedRoom(sessionId);
		}
	}

	private static roomExists(roomId): boolean {
		return Application.getRoomStorage().containsKey(roomId);
	}

	private static setLinkedRoom(sessionId, roomId): Room {
		Application.getPlayerRoomStorage().set(sessionId, roomId);
		return Application.getRoomStorage().get(roomId);
	}

	private static removeLinkedRoom(sessionId): null {
		Application.getPlayerRoomStorage().delete(sessionId);
		return null;
	}

	public static reassignHost({ playerId, sessionId }: PlayerIdentifiers): Room {
		const session = Application.getSessionStorage().get(sessionId);
		const roomId = Application.getPlayerRoomStorage().get(sessionId);

		const updatedRoom = Application.getRoomStorage().addPlayer(roomId, PlayerFactory.create(session));
		if (!updatedRoom.hasHost()) {
			updatedRoom.assignHost(playerId);
		}

		return updatedRoom;
	}
}