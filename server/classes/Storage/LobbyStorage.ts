import Player from '../Player';
import Lobby from '../Lobby';
import Storage from './Storage';

export default class LobbyStorage extends Storage<string, Lobby> {
	isPlayerPresent(id: Lobby['id'], player: Player): boolean {
		const foundLobby: Lobby = this.get(id);

		if (foundLobby) {
			return foundLobby.isPlayerPresent(player.id);
		}

		return false;
	}

	addPlayer(id: Lobby['id'], player: Player): Lobby {
		const lobby = this.get(id);

		if (lobby && !lobby.isPlayerPresent(player.id)) {
			lobby.add(player);
		}

		return lobby;
	}

	removePlayer(id: Lobby['id'], playerId: Player['id']): Lobby {
		const lobby = this.get(id);

		if (lobby) {
			lobby.remove(playerId);
		}

		return lobby;
	}
}
