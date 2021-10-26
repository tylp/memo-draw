import SocketMock from 'socket.io-mock';
import Application from '../classes/Application';

export default class SocketMockFactory {
	static create(): SocketMock {
		const socket = new SocketMock();
		socket.handshake = { auth: { sessionId: Application.getSessionStorage().generate().sessionId } };
		return socket;
	}
}