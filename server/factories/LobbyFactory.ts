import Application from '../classes/Application';
import Lobby from '../classes/Lobby/Lobby';
import IdGeneratorService from '../services/IdGeneratorService';

export default class LobbyFactory {
	public static create(hostPlayerId: string): Lobby {
		const lobbyId = IdGeneratorService.generate()
		return Application.getLobbyStorage().set(lobbyId, new Lobby(lobbyId, hostPlayerId));
	}
}