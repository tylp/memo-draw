import { Server } from 'socket.io';
import SocketIoHandler from './sockets/SocketIoHandler';
import PlayerIdSessionIdStorage from './Storage/PlayerIdSessionIdStorage';
import PlayerRoomStorage from './Storage/PlayerRoomStorage';
import RoomStorage from './Storage/RoomStorage';
import SessionStorage from './Storage/SessionStorage';

export default class Application {
	private static instance: Application;

	private sessionStorage: SessionStorage;
	private roomStorage: RoomStorage;
	private playerRoomStorage: PlayerRoomStorage;
	private playerIdSessionIdStorage: PlayerIdSessionIdStorage;

	private constructor() {
		this.sessionStorage = new SessionStorage();
		this.roomStorage = new RoomStorage();
		this.playerRoomStorage = new PlayerRoomStorage();
		this.playerIdSessionIdStorage = new PlayerIdSessionIdStorage();
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

	static getPlayerRoomStorage(): PlayerRoomStorage {
		return Application.getInstance().playerRoomStorage;
	}

	static getPlayerIdSessionIdStorage(): PlayerIdSessionIdStorage {
		return Application.getInstance().playerIdSessionIdStorage;
	}
}
