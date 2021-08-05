import PlayerFactory from '../../factories/PlayerFactory';
import Application from "../Application";
import SocketBinder from "./SocketBinder";

export default class RoomSocketBinder extends SocketBinder {
    static bindSocket(socket): void {
        this.onJoinRoom(socket);
        this.onMessageRoom(socket);
    }

    private static onJoinRoom(socket): void {        
        socket.on("join-room", (roomId, ack) => {
            if(Application.getRoomStorage().exists(roomId)) {
                socket.join(`room-${roomId}`)
                const updatedRoom = Application.getRoomStorage().addPlayer(roomId, PlayerFactory.createPlayer(socket));
                socket.to(`room-${roomId}`).emit("update-room", updatedRoom);
                ack(updatedRoom);
            } else {
                ack(false);
            }
        })
    }

    private static onMessageRoom(socket): void {
        const player = PlayerFactory.createPlayer(socket);
        socket.on("send-message-room", (content, roomId) => {
            if(Application.getRoomStorage().isPlayerPresent(roomId, player)) {
                socket.to(`room-${roomId}`).emit("receive-message-room", {
                    username: player.profile.username,
                    content
                })
            }
        });
    }
}