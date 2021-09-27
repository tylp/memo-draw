import Application from '../classes/Application';
import Room from '../classes/Room';
import IdGeneratorService from '../services/IdGeneratorService';

export default class RoomFactory {
	public static create(creatorPlayerId: string): Room {
		const roomId = IdGeneratorService.generate()
		return Application.getRoomStorage().set(roomId, new Room(roomId, creatorPlayerId));
	}
}