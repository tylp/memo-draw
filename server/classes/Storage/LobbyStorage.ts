import Player from '../Player';
import Lobby from '../Lobby';
import Storage from './Storage';

export default class LobbyStorage extends Storage<string, Lobby> {
	isPlayerPresent(lobbyId: string, player: Player): boolean {
		const foundLobby: Lobby = this.get(lobbyId);

		if (foundLobby) {
			return foundLobby.isPlayerPresent(player.id);
		}

		return false;
	}

	addPlayer(id: string, player: Player): Lobby {
		const room = this.get(id);

		if (room && !room.isPlayerPresent(player.id)) {
			room.add(player);
		}

		return room;
	}

	removePlayer(id: string, playerId: string): Lobby {
		const room = this.get(id);

		if (room) {
			room.remove(playerId);
		}

		return room;
	}
}
