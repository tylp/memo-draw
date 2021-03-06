import { Socket } from 'socket.io';
import Application from '../classes/Application';
import ISession from '../interfaces/ISession';

export default class SocketIdentifierService {
	public static getSessionIdentifier(socket: Socket): string {
		return socket.handshake.auth.sessionId;
	}

	public static getPlayerIdentifier(socket: Socket): string {
		return this.getSessionOf(socket)?.playerId;
	}

	public static getIdentifiersOf(socket: Socket): { sessionId: string, playerId: string } {
		return {
			sessionId: this.getSessionIdentifier(socket),
			playerId: this.getPlayerIdentifier(socket),
		};
	}

	public static getSessionOf(socket: Socket): ISession {
		return Application.getSessionStorage().get(this.getSessionIdentifier(socket));
	}
}