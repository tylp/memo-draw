import { GameModeProperties } from './../enums/GameProperties';
import Application from '../classes/Application';
import Player from '../classes/Player';
import Lobby from '../classes/Lobby/Lobby';
import PlayerFactory from '../factories/PlayerFactory';
import LobbyFactory from '../factories/LobbyFactory';
import ISession from '../interfaces/ISession';
import { YesOrNo } from '../classes/Votes/YesNoVote';

interface PlayerIdentifiers {
	playerId: string;
	sessionId: string;
}

export default class LobbyService {

	public static create({ playerId, sessionId }: PlayerIdentifiers): Lobby {
		const lobby = LobbyFactory.create(playerId);
		this.linkPlayerToLobby(sessionId, lobby.id);
		Application.getSessionStorage().update(sessionId, { playerLobbyId: lobby.id })
		return lobby;
	}

	public static linkPlayerToLobby(sessionId: ISession['sessionId'], lobbyId: Lobby['id']): void {
		Application.getPlayerLobbyStorage().set(sessionId, lobbyId)
	}

	public static reassignHost({ playerId, sessionId }: PlayerIdentifiers): Lobby {
		const session = Application.getSessionStorage().get(sessionId);
		const lobbyId = Application.getPlayerLobbyStorage().get(sessionId);

		const updatedLobby = Application.getLobbyStorage().addPlayer(lobbyId, PlayerFactory.create(session));
		if (updatedLobby && !updatedLobby.hasHost()) {
			updatedLobby.assignHost(playerId);
		}

		return updatedLobby;
	}

	public static start(lobby: Lobby, player: Player, gameMode: GameModeProperties): boolean {
		if (lobby.hostPlayerId === player.id) {
			lobby.startGame(gameMode);
			return true;
		}
		return false;
	}

	public static kick({ playerId, sessionId }: PlayerIdentifiers, kickedPlayerId: string): Lobby {
		const lobbyOfCurrentPlayer = Application.getPlayerLobbyStorage().getLobbyOf(sessionId)
		const kickedSessionId = Application.getPlayerIdSessionIdStorage().get(kickedPlayerId);

		if (lobbyOfCurrentPlayer.hostIs(playerId)) {
			this.quit({ playerId: kickedPlayerId, sessionId: kickedSessionId });
		}

		return lobbyOfCurrentPlayer;
	}

	public static quit({ playerId, sessionId }: PlayerIdentifiers): Lobby {
		const lobbyOfCurrentPlayer = Application.getPlayerLobbyStorage().getLobbyOf(sessionId)

		Application.getPlayerLobbyStorage().delete(sessionId);

		return lobbyOfCurrentPlayer?.remove(playerId);
	}

	public static startVote({ sessionId }: PlayerIdentifiers, selectedDrawing: number): Lobby {
		const lobbyOfCurrentPlayer = Application.getPlayerLobbyStorage().getLobbyOf(sessionId)

		if (lobbyOfCurrentPlayer && lobbyOfCurrentPlayer.game) {
			lobbyOfCurrentPlayer.game.startVote(selectedDrawing);
		}

		return lobbyOfCurrentPlayer;
	}

	public static vote({ playerId, sessionId }: PlayerIdentifiers, vote: YesOrNo): Lobby {
		const lobbyOfCurrentPlayer = Application.getPlayerLobbyStorage().getLobbyOf(sessionId)

		lobbyOfCurrentPlayer?.game.currentVote.vote(playerId, vote);

		return lobbyOfCurrentPlayer;
	}
}