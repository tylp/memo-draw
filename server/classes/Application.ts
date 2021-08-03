import { Server, Socket } from 'socket.io';
import RoomStorage from "../RoomStorage";
import IdGeneratorService from "../services/IdGeneratorService";
import SessionStorage from "../SessionStorage";
import Room from "./Room";
import CommonSocketBinder from "./sockets/CommonSocketBinder";
import IndexSocketBinder from './sockets/IndexSocketBinder';
import RoomSocketBinder from './sockets/RoomSocketBinder';

export default class Application {
    private static instance: Application;

    sessionStore: SessionStorage;
    roomStore: RoomStorage;
    io: Server;

    private constructor(io) {
        this.sessionStore = new SessionStorage();
        this.roomStore = new RoomStorage();
        this.io = io;
    }

    static generateInstance(io: Server): Application {
        if(!Application.instance) {
            Application.instance = new Application(io);
        }
        return Application.getInstance();
    }

    static getInstance(): Application {
        return this.instance;
    }

    handleConnection(socket: Socket): void {
        CommonSocketBinder.bindSocket(socket);
        IndexSocketBinder.bindSocket(socket);
        RoomSocketBinder.bindSocket(socket);
    }

    createRoom(name: string): Room {
        return this.roomStore.save(new Room(IdGeneratorService.generate(), name));
    }
}