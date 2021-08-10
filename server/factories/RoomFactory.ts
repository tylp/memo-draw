import { Socket } from 'socket.io';
import Application from '../classes/Application';
import Room from '../classes/Room';
import IdGeneratorService from '../services/IdGeneratorService';
import SocketIdentifierService from '../services/SocketIdentifierService';

export default class RoomFactory {
    public static create(socket: Socket): Room {
        const roomId = IdGeneratorService.generate()
        return Application.getRoomStorage().set(roomId, new Room(roomId, SocketIdentifierService.getPlayerIdentifier(socket)));
    }
}