import SocketMock from 'socket.io-mock';
import Application from '../classes/Application';
import ISession from '../interfaces/ISession';

export default class SocketMockFactory {
	static create(session?: ISession): SocketMock {
		const socket = new SocketMock();
		socket.handshake = { auth: { sessionId: session?.sessionId || Application.getSessionStorage().generate().sessionId } };
		return socket;
	}
}