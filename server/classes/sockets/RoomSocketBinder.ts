import { Socket } from 'socket.io';
import Room from '../Room';
import PlayerFactory from '../../factories/PlayerFactory';
import Application from "../Application";
import SocketBinder from "./SocketBinder";
import SocketIdentifierService from '../../services/SocketIdentifierService';

export default class RoomSocketBinder extends SocketBinder {
    static bindSocket(socket: Socket): void {
        this.onJoinRoom(socket);
        this.onMessageRoom(socket);
        this.onDrawing(socket);
        this.onDisconnection(socket);
    }

    private static onJoinRoom(socket: Socket): void {        
        socket.on("join-room", (roomId, ack) => {
            if(Application.getRoomStorage().containsKey(roomId)) {
                Application.getPlayerRoomStorage().set(SocketIdentifierService.getSessionIdentifier(socket), roomId);
                socket.join(Room.getRoomName(roomId))
                const updatedRoom = Application.getRoomStorage().addPlayer(roomId, PlayerFactory.create(socket));
                socket.to(Room.getRoomName(roomId)).emit("update-room", updatedRoom);
                ack(updatedRoom);
            } else {
                ack(false);
            }
        })
    }

    private static onMessageRoom(socket: Socket): void {
        const player = PlayerFactory.create(socket);
        socket.on("send-message-room", (content, roomId) => {
            if(Application.getRoomStorage().isPlayerPresent(roomId, player)) {
                socket.to(Room.getRoomName(roomId)).emit("receive-message-room", {
                    username: player.profile.username,
                    content
                })
            }
        });
    }

    private static onDrawing(socket: Socket): void {
        const player = PlayerFactory.create(socket);
        socket.on("send-drawing", (coords, roomId) => {
            if(Application.getRoomStorage().isPlayerPresent(roomId, player)) {
                socket.to(Room.getRoomName(roomId)).emit("receive-drawing", coords)
            }
        })
    }
    
    private static onDisconnection(socket: Socket): void {
        const player = PlayerFactory.create(socket);
        socket.on("disconnect", () => {
            const roomId = Application.getPlayerRoomStorage().get(SocketIdentifierService.getSessionIdentifier(socket));
            const room: Room = Application.getRoomStorage().removePlayer(roomId, player);
            socket.to(Room.getRoomName(roomId)).emit("update-room", room);
        })
    }
}