import { Server } from 'socket.io';
import SocketIoBinder from './sockets/SocketIoHandler';
import SocketIoHandler from './sockets/SocketIoHandler';
import RoomStorage from './Storage/RoomStorage';
import SessionStorage from './Storage/SessionStorage';

export default class Application {
    private static instance: Application;

    sessionStorage: SessionStorage;
    roomStorage: RoomStorage;
    socketIoHandler: SocketIoHandler;
    io: Server;

    private constructor(io: Server) {
        this.sessionStorage = new SessionStorage();
        this.roomStorage = new RoomStorage();
        this.io = SocketIoBinder.bindServer(io);
    }

    static generateInstance(io: Server): Application {
        if (!Application.instance) {
            Application.instance = new Application(io);
        }
        return Application.getInstance();
    }

    static getInstance(): Application {
        return this.instance;
    }

    static getSessionStorage(): SessionStorage {
        return Application.getInstance().sessionStorage;
    }

    static getRoomStorage(): RoomStorage {
        return Application.getInstance().roomStorage;
    }
}