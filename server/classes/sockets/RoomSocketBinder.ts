import { Socket } from 'socket.io';
import Application from "../Application";
import Player from "../Player";
import SocketBinder from "./SocketBinder";

export default class RoomSocketBinder extends SocketBinder {
    static bindSocket(socket): void {
        this.onManualDisconnect(socket);
        this.onDisconnect(socket);
        this.onRoomJoined(socket);
        this.onNewMessage(socket);
        this.onDrawing(socket);
    }
    
    private static onManualDisconnect(socket): void {
        socket.on("manual-disconnect", () => {
            console.log("manual disconnect");
        });
    }
    
    private static onDisconnect(socket: Socket): void {
        // notify users upon disconnection
        socket.on("disconnect", async () => {
            const session = Application.getInstance().getSocketSession(socket);
            
            Application.getInstance().roomStore.removePlayer(session.roomID, new Player(session.userID, session.username));
            socket.leave(session.roomID);
            Application.getInstance().sessionStore.setSessionRoomID(session.sessionID, null)
            socket.to(session.roomID).emit("player disconnected", session.userID);
        });
    }

    private static onRoomJoined(socket): void {
        socket.on("joining-room", function(roomID, user, isUnknown){

            const joiningPlayer: Player = new Player(socket.userID, socket.username);

            if (!Application.getInstance().roomStore.find(roomID)){
                return isUnknown();
            }
            else {
                console.log('joining-room: ', roomID);
                socket.join(roomID);
                socket.roomID = roomID;
                Application.getInstance().sessionStore.setSessionRoomID(user.sessionID, roomID);
                
                // send room players list to emmitter
                socket.emit("clients", Application.getInstance().sessionStore.findAllSessionsOfRoom(roomID));

                // send room players newcomer infos
                socket.to(roomID).emit("player connected", Application.getInstance().sessionStore.findSession(user.sessionID));

                // send room players a welcome message
                // io.of('/room').in(roomID).emit("new message", {username: 'Memo-Draw Bot', content: `Bienvenue dans le ${Application.getInstance().roomStore.find(roomID).name} ${user.username} !`});

                // update nbPlayer in room
                Application.getInstance().roomStore.addPlayer(roomID, joiningPlayer);
                // io.of('/').emit('add-nb-player', roomID);
            }
        });
    }
    
    private static onNewMessage(socket): void {
        socket.on("new message", (message, roomID) => {
            // io.of('/room').in(roomID).emit("new message", {username: socket.username, content: message});
        })
    }
    
    private static onDrawing(socket): void {
        // Broadcast draw to everyone in the room
        socket.on('drawing', (data) => {
            socket.to(socket.roomID).emit('drawing', data)
        });
    }
}