import { Server } from 'socket.io';
import SocketIoHandler from './sockets/SocketIoHandler';
import PlayerIdSessionIdStorage from './Storage/PlayerIdSessionIdStorage';
import PlayerLobbyStorage from './Storage/PlayerLobbyStorage';
import RoomStorage from './Storage/RoomStorage';
import SessionStorage from './Storage/SessionStorage';

export default class Application {
	protected static instance: Application;

	protected sessionStorage: SessionStorage = new SessionStorage();
	protected roomStorage: RoomStorage = new RoomStorage();
	protected playerRoomStorage: PlayerLobbyStorage = new PlayerLobbyStorage();
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

	static getRoomStorage(): RoomStorage {
		return Application.getInstance().roomStorage;
	}

	static getPlayerLobbyStorage(): PlayerLobbyStorage {
		return Application.getInstance().playerRoomStorage;
	}

	static getPlayerIdSessionIdStorage(): PlayerIdSessionIdStorage {
		return Application.getInstance().playerIdSessionIdStorage;
	}
}
