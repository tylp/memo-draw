import { Socket } from 'socket.io';
import SocketBinder from "./SocketBinder";

export default class GameSocketBinder extends SocketBinder {
    static bindSocket(socket: Socket): void {
        console.log(socket);
    }
}