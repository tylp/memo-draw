import SocketIdentifierService from './SocketIdentifierService';
import MockedSocket from 'socket.io-mock';
import Application from '../classes/Application';
import ISession from '../interfaces/ISession';

describe('SocketIdentifierService', () => {
	let session: ISession;
	let mockSock: MockedSocket;

	beforeAll(() => {
		session = Application.getSessionStorage().generate();
		mockSock = new MockedSocket();
		mockSock.handshake = {auth: {sessionId: session.sessionId}};
	});

	test('getSessionIdentifier should work', () => {
		expect(SocketIdentifierService.getSessionIdentifier(mockSock)).toBe(session.sessionId);
	});
	
	test('getPlayerIdentifier should work', () => {
		expect(SocketIdentifierService.getPlayerIdentifier(mockSock)).toBe(session.playerId);
	});

	test('getSessionOf should work', () => {
		expect(SocketIdentifierService.getSessionOf(mockSock).sessionId).toBe(session.sessionId);
	});
});
