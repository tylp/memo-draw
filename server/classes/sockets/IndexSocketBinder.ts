import { Socket } from 'socket.io';
import Application from "../Application";
import SocketBinder from "./SocketBinder";

export default class IndexSocketBinder extends SocketBinder {
    static bindSocket(socket: Socket): void {
        this.onRoomCreation(socket);
    }
    
    private static onRoomCreation(socket: Socket): void {
        socket.on("create-room", function(){
            Application.getInstance().io.emit('new-room', Application.getInstance().createRoom())
        });
    }
}