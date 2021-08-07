import { Server, Socket } from 'socket.io';
import ISession from '../interfaces/ISession';
import IdGeneratorService from "../services/IdGeneratorService";
import SocketIdentifierService from '../services/SocketIdentifierService';
import Room from "./Room";
import RoomSocketBinder from './sockets/RoomSocketBinder';
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

    getSocketSession(socket: Socket): ISession {
        return Application.getSessionStorage().get(SocketIdentifierService.getSessionIdentifier(socket));
    }

    handleConnection(socket: Socket): void {
        RoomSocketBinder.bindSocket(socket);
    }

    createRoom(): Room {
        const roomId = IdGeneratorService.generate()
        return Application.getRoomStorage().set(roomId, new Room(roomId));
    }
}