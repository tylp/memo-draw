import { Socket } from 'socket.io';
import Application from "../Application";
import SocketBinder from "./SocketBinder";

export default class RoomSocketBinder extends SocketBinder {
    static bindSocket(socket): void {
        this.onManualDisconnect(socket);
        this.onDisconnect(socket);
    }
    
    private static onManualDisconnect(socket): void {
        socket.on("manual-disconnect", () => {
            console.log("manual disconnect");
        });
    }
    
    private static onDisconnect(socket): void {
        // notify users upon disconnection
        socket.on("disconnect", async () => {
            console.log('a user has been disconnected');
            const matchingSockets = await Application.getInstance().io.in(socket.userID).allSockets();
            const isDisconnected = matchingSockets.size === 0;
            if (isDisconnected) {
                // notify other users
                socket.broadcast.emit("user disconnected", socket.userID);
                // update the connection status of the session
                Application.getInstance().sessionStore.saveSession(socket.sessionID, {
                    userID: socket.userID,
                    username: socket.username,
                    connected: false,
                });
            }
        });    
    }
}