import { Socket } from 'socket.io';
import Application from "../Application";
import SocketBinder from "./SocketBinder";

export default class CommonSocketBinder extends SocketBinder {
    static bindSocket(socket): void {
        console.log(socket);
        this.persistSession(socket);
        this.sendSessionToClient(socket);
    }
    
    private static persistSession(socket): void {
        Application.getInstance().sessionStore.saveSession(socket.sessionID, {
            userID: socket.userID,
            username: socket.username,
            connected: true,
        });
    }
    
    private static sendSessionToClient(socket): void {
        socket.emit("session", {
            sessionID: socket.sessionID,
            ...Application.getInstance().sessionStore.findSession(socket.sessionID)
        });
    }
}