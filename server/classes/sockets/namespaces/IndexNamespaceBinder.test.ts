/* eslint-disable @typescript-eslint/no-explicit-any */
import { MocketServer } from 'mockets.io';
import ProfileValidatorService from '../../../services/ProfileValidatorService';
import SocketIdentifierService from '../../../services/SocketIdentifierService';
import ResetableApplication from '../../../tests/ResetableApplication/ResetableApplication';
import Application from '../../Application';

describe('IndexNamespaceBinder', () => {
	let mocketServer: any;

	beforeEach(() => {
		ResetableApplication.reset();
		mocketServer = new MocketServer();
		Application.getInstance().bindServer(mocketServer);
	})

	test('Socket connecting for first time should have new session attached', () => {
		expect(Application.getSessionStorage().toArray().length).toBe(0);

		const mockedSocket = mocketServer.createSocket();

		const socketPlayerId = SocketIdentifierService.getPlayerIdentifier(mockedSocket.serverSideSocket);
		const socketSessionId = SocketIdentifierService.getSessionIdentifier(mockedSocket.serverSideSocket)

		expect(Application.getSessionStorage().toArray().length).toBe(1);
		expect(socketPlayerId).toBeDefined();
		expect(socketSessionId).toBeDefined();
		expect(socketPlayerId).toBe(Application.getSessionStorage().get(socketSessionId).playerId);
	})

	test('Socket connecting for first time should have player id linked to session id', () => {
		expect(Application.getPlayerIdSessionIdStorage().toArray().length).toBe(0);

		const mockedSocket = mocketServer.createSocket();

		const socketPlayerId = SocketIdentifierService.getPlayerIdentifier(mockedSocket);
		const socketSessionId = SocketIdentifierService.getSessionIdentifier(mockedSocket)

		expect(Application.getPlayerIdSessionIdStorage().get(socketPlayerId)).toBe(socketSessionId);
	})

	test('Socket can update its profile', () => {
		const mockedSocket = mocketServer.createSocket();

		const socketSessionId = SocketIdentifierService.getSessionIdentifier(mockedSocket.serverSideSocket);
		const socketProfile = SocketIdentifierService.getSessionOf(mockedSocket.serverSideSocket).profile;
		const newProfile = { ...socketProfile, username: 'My new username!' };

		let hasBeenTriggered = false;
		const ack = () => {
			hasBeenTriggered = true;
		}

		expect(Application.getSessionStorage().get(socketSessionId).profile.username).toBe(socketProfile.username);

		mockedSocket.emit('update-profile', newProfile, ack);

		expect(ProfileValidatorService.validate(newProfile)).toBeTruthy();
		expect(hasBeenTriggered).toBeTruthy();
	})
})