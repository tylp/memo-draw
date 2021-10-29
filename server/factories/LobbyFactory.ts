import Application from '../classes/Application';
import Room from '../classes/Room';
import IdGeneratorService from '../services/IdGeneratorService';

export default class LobbyFactory {
	public static create(hostPlayerId: string): Room {
		const roomId = IdGeneratorService.generate()
		return Application.getLobbyStorage().set(roomId, new Room(roomId, hostPlayerId));
	}
}