import SocketIdentifierService from './SocketIdentifierService';
import SocketMock from 'socket.io-mock';
import SocketMockFactory from '../tests/SocketMockFactory';
import ISession from '../interfaces/ISession';
import Application from '../classes/Application';
import ResetableApplication from '../tests/ResetableApplication/ResetableApplication';

describe('SocketIdentifierService', () => {
	let socketMock: SocketMock;
	let session: ISession;

	beforeEach(() => {
		ResetableApplication.reset();
		socketMock = SocketMockFactory.create();
		session = Application.getSessionStorage().toArray()[0];
	});

	test('getSessionIdentifier should work', () => {
		expect(SocketIdentifierService.getSessionIdentifier(socketMock)).toBe(session.sessionId);
	});

	test('getPlayerIdentifier should work', () => {
		expect(SocketIdentifierService.getPlayerIdentifier(socketMock)).toBe(session.playerId);
	});

	test('getSessionOf should work', () => {
		expect(SocketIdentifierService.getSessionOf(socketMock).sessionId).toBe(session.sessionId);
	});
});
