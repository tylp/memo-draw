import { Server } from 'socket.io';
import SocketIoHandler from './sockets/SocketIoHandler';
import PlayerIdSessionIdStorage from './Storage/PlayerIdSessionIdStorage';
import PlayerLobbyStorage from './Storage/PlayerLobbyStorage';
import LobbyStorage from './Storage/LobbyStorage';
import SessionStorage from './Storage/SessionStorage';
import { Lobby } from '.';

export default class Application {
	protected static instance: Application;

	protected sessionStorage: SessionStorage = new SessionStorage();
	protected lobbyStorage: LobbyStorage = new LobbyStorage();
	protected playerLobbyStorage: PlayerLobbyStorage = new PlayerLobbyStorage();
	protected playerIdSessionIdStorage: PlayerIdSessionIdStorage = new PlayerIdSessionIdStorage();
	protected io: Server;

	protected constructor() {
		//
	}

	static getInstance(): Application {
		if (!Application.instance) {
			Application.instance = new Application();
		}
		return Application.instance;
	}

	static startClearEmptyLobbies(): void {
		setInterval(() => {
			const emptyLobbies = Application.getLobbyStorage().toArray().filter((e: Lobby) => e.isEmpty());
			emptyLobbies.forEach((e: Lobby) => {
				Application.getLobbyStorage().delete(e.id);
			})
		}, 900000) // 15 minutes
	}

	bindServer(io: Server): void {
		SocketIoHandler.bindServer(io);
		this.io = io;
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

	static getSocketIoInstance(): Server {
		return Application.getInstance().io;
	}
}
