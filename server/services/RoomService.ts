import Application from '../classes/Application';
import Player from '../classes/Player';
import Room from '../classes/Room';
import PlayerFactory from '../factories/PlayerFactory';
import RoomFactory from '../factories/RoomFactory';
import ISession from '../interfaces/ISession';

interface PlayerIdentifiers {
	playerId: string;
	sessionId: string;
}

export default class RoomService {

	public static create({ playerId, sessionId }: PlayerIdentifiers): Room {
		const room = RoomFactory.create(playerId);
		this.linkPlayerToRoom(sessionId, room.id);
		Application.getSessionStorage().update(sessionId, { playerRoomId: room.id })
		return room;
	}

	public static linkPlayerToRoom(sessionId: ISession['sessionId'], roomId: Room['id']): void {
		Application.getPlayerRoomStorage().set(sessionId, roomId)
	}

	public static reassignHost({ playerId, sessionId }: PlayerIdentifiers): Room {
		const session = Application.getSessionStorage().get(sessionId);
		const roomId = Application.getPlayerRoomStorage().get(sessionId);

		const updatedRoom = Application.getRoomStorage().addPlayer(roomId, PlayerFactory.create(session));
		if (updatedRoom && !updatedRoom.hasHost()) {
			updatedRoom.assignHost(playerId);
		}

		return updatedRoom;
	}

	public static start(room: Room, player: Player): boolean {
		if (room.hostPlayerId === player.id) {
			room.startGame();
			return true;
		}
		return false;
	}

	public static kick({ playerId, sessionId }: PlayerIdentifiers, kickedPlayerId: string): Room {
		const roomOfCurrentPlayer = Application.getPlayerRoomStorage().getRoomOf(sessionId)
		const kickedSessionId = Application.getPlayerIdSessionIdStorage().get(kickedPlayerId);

		if (roomOfCurrentPlayer.hostIs(playerId)) {
			this.quit({ playerId: kickedPlayerId, sessionId: kickedSessionId });
		}

		return roomOfCurrentPlayer;
	}

	public static quit({ playerId, sessionId }: PlayerIdentifiers): Room {
		const roomOfCurrentPlayer = Application.getPlayerRoomStorage().getRoomOf(sessionId)

		Application.getPlayerRoomStorage().delete(sessionId);

		if (roomOfCurrentPlayer?.hostIs(playerId)) {
			roomOfCurrentPlayer.assignRandomHost();
		}

		return roomOfCurrentPlayer?.remove(playerId);
	}
}