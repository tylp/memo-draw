/* eslint-disable @typescript-eslint/no-explicit-any */
import SocketIdentifierService from './SocketIdentifierService';
import ISession from '../interfaces/ISession';
import Application from '../classes/Application';
import ResetableApplication from '../tests/ResetableApplication/ResetableApplication';
import { MocketServer } from 'mockets.io';

describe('SocketIdentifierService', () => {
	let mocketServer: MocketServer;
	let socketMock: any;
	let session: ISession;

	beforeEach(() => {
		ResetableApplication.reset();
		mocketServer = new MocketServer();
		socketMock = mocketServer.createSocket();
		session = Application.getSessionStorage().generate();
		socketMock.handshake = {
			auth: {
				sessionId: session.sessionId,
			},
		}
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
