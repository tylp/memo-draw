import Application from '../classes/Application';
import Player from '../classes/Player';
import Lobby from '../classes/Lobby';
import PlayerFactory from '../factories/PlayerFactory';
import LobbyFactory from '../factories/LobbyFactory';
import ISession from '../interfaces/ISession';

interface PlayerIdentifiers {
	playerId: string;
	sessionId: string;
}

export default class LobbyService {

	public static create({ playerId, sessionId }: PlayerIdentifiers): Lobby {
		const room = LobbyFactory.create(playerId);
		this.linkPlayerToLobby(sessionId, room.id);
		Application.getSessionStorage().update(sessionId, { playerLobbyId: room.id })
		return room;
	}

	public static linkPlayerToLobby(sessionId: ISession['sessionId'], roomId: Lobby['id']): void {
		Application.getPlayerLobbyStorage().set(sessionId, roomId)
	}

	public static reassignHost({ playerId, sessionId }: PlayerIdentifiers): Lobby {
		const session = Application.getSessionStorage().get(sessionId);
		const roomId = Application.getPlayerLobbyStorage().get(sessionId);

		const updatedLobby = Application.getLobbyStorage().addPlayer(roomId, PlayerFactory.create(session));
		if (updatedLobby && !updatedLobby.hasHost()) {
			updatedLobby.assignHost(playerId);
		}

		return updatedLobby;
	}

	public static start(room: Lobby, player: Player): boolean {
		if (room.hostPlayerId === player.id) {
			room.startGame();
			return true;
		}
		return false;
	}

	public static kick({ playerId, sessionId }: PlayerIdentifiers, kickedPlayerId: string): Lobby {
		const roomOfCurrentPlayer = Application.getPlayerLobbyStorage().getLobbyOf(sessionId)
		const kickedSessionId = Application.getPlayerIdSessionIdStorage().get(kickedPlayerId);

		if (roomOfCurrentPlayer.hostIs(playerId)) {
			this.quit({ playerId: kickedPlayerId, sessionId: kickedSessionId });
		}

		return roomOfCurrentPlayer;
	}

	public static quit({ playerId, sessionId }: PlayerIdentifiers): Lobby {
		const roomOfCurrentPlayer = Application.getPlayerLobbyStorage().getLobbyOf(sessionId)

		Application.getPlayerLobbyStorage().delete(sessionId);

		return roomOfCurrentPlayer?.remove(playerId);
	}
}