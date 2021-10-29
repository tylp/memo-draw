import Application from '../classes/Application';
import Lobby from '../classes/Lobby';
import IdGeneratorService from '../services/IdGeneratorService';

export default class LobbyFactory {
	public static create(hostPlayerId: string): Lobby {
		const roomId = IdGeneratorService.generate()
		return Application.getLobbyStorage().set(roomId, new Lobby(roomId, hostPlayerId));
	}
}