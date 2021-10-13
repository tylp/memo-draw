import { Socket } from 'socket.io';
import ISession from '../../interfaces/ISession';
import SocketIdentifierService from '../../services/SocketIdentifierService';
import Application from '../Application';
import SocketBinder from './SocketBinder';

export default class CommonSocketBinder extends SocketBinder {
	static bindSocket(socket: Socket): void {
		this.ensureCorrectSessionFor(socket);

		this.onUpdateProfile(socket);
	}

	private static ensureCorrectSessionFor(socket: Socket) {
		if (!this.socketHasSession(socket)) {
			this.generateSessionAndBindIdentifiersFor(socket);
			this.sendSessionToSocket(socket);
		}
	}

	private static socketHasSession(socket: Socket) {
		const sessionId = SocketIdentifierService.getSessionIdentifier(socket);
		return sessionId && Application.getSessionStorage().containsKey(sessionId)
	}

	private static generateSessionAndBindIdentifiersFor(socket: Socket) {
		const session = Application.getSessionStorage().generate();
		this.bindSessionIdentifiersTo(socket, session);
	}

	private static bindSessionIdentifiersTo(socket: Socket, session: ISession) {
		socket.handshake.auth.sessionId = session.sessionId;
		socket.handshake.auth.playerId = session.playerId;
	}

	private static sendSessionToSocket(socket: Socket) {
		const session = Application.getSessionStorage().get(SocketIdentifierService.getSessionIdentifier(socket));
		socket.emit('update-session', session);
	}

	private static onUpdateProfile(socket: Socket) {
		socket.on('update-profile', (profile, ack) => {
			if (ack) {
				ack();
			}
			Application.getSessionStorage().update(SocketIdentifierService.getSessionIdentifier(socket), { profile });
		})
	}
}