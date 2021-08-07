import { Socket } from 'socket.io';
import Application from '../classes/Application';
import Player from "../classes/Player";
import SocketIdentifierService from '../services/SocketIdentifierService';

export default class PlayerFactory {
    public static createPlayer(socket: Socket): Player {
        const sessionId = SocketIdentifierService.getSessionIdentifier(socket);
        const playerId = SocketIdentifierService.getPlayerIdentifier(socket);
        const session = Application.getSessionStorage().get(sessionId);
        
        return new Player(playerId, session.profile);
    }
}