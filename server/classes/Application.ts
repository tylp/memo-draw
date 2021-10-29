import { Server } from 'socket.io';
import SocketIoHandler from './sockets/SocketIoHandler';
import PlayerIdSessionIdStorage from './Storage/PlayerIdSessionIdStorage';
import PlayerLobbyStorage from './Storage/PlayerLobbyStorage';
import LobbyStorage from './Storage/LobbyStorage';
import SessionStorage from './Storage/SessionStorage';

export default class Application {
	protected static instance: Application;

	protected sessionStorage: SessionStorage = new SessionStorage();
	protected lobbyStorage: LobbyStorage = new LobbyStorage();
	protected playerLobbyStorage: PlayerLobbyStorage = new PlayerLobbyStorage();
	protected playerIdSessionIdStorage: PlayerIdSessionIdStorage = new PlayerIdSessionIdStorage();

	protected constructor() {
		//
	}

	static getInstance(): Application {
		if (!Application.instance) {
			Application.instance = new Application();
		}
		return Application.instance;
	}

	static bindServer(io: Server): void {
		SocketIoHandler.bindServer(io);
	}

	static getSessionStorage(): SessionStorage {
		return Application.getInstance().sessionStorage;
	}

	static getLobbyStorage(): LobbyStorage {
		return Application.getInstance().lobbyStorage;
	}

	static getPlayerLobbyStorage(): PlayerLobbyStorage {
		return Application.getInstance().playerLobbyStorage;
	}

	static getPlayerIdSessionIdStorage(): PlayerIdSessionIdStorage {
		return Application.getInstance().playerIdSessionIdStorage;
	}
}
