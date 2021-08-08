import { Socket } from 'socket.io';
import RoomFactory from '../../factories/RoomFactory';
import SocketBinder from "./SocketBinder";

export default class IndexSocketBinder extends SocketBinder {
    static bindSocket(socket: Socket): void {
        this.onRoomCreation(socket);
    }
    
    private static onRoomCreation(socket: Socket): void {
        socket.on("create-room", (ack) => {
            ack(RoomFactory.create(socket));
        });
    }
}