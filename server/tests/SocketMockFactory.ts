/* eslint-disable @typescript-eslint/no-explicit-any */
import { MocketSocket } from 'mockets.io';
import Application from '../classes/Application';
import ISession from '../interfaces/ISession';

export default class SocketMockFactory {
	static create(session?: ISession): MocketSocket {
		const socket: any = new MocketSocket();
		socket.handshake = { auth: { sessionId: session?.sessionId || Application.getSessionStorage().generate().sessionId } };
		return socket;
	}
}