import { Socket } from 'socket.io';
import Application from '../classes/Application';
export default class SocketIdentifierService {
    public static getSessionIdentifier(socket: Socket): string {
        return socket.handshake.auth.sessionId;
    }

    public static getPlayerIdentifier(socket: Socket): string {
        const sessionId = this.getSessionIdentifier(socket);
        return Application.getSessionStorage().findSession(sessionId).playerId;
    }
}