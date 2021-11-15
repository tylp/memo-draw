/* eslint-disable @typescript-eslint/no-explicit-any */
import { MocketServer } from 'mockets.io';
import Application from '../classes/Application';
import Lobby from '../classes/Lobby/Lobby';
import ISession from '../interfaces/ISession';
import SocketIdentifierService from '../services/SocketIdentifierService';
import ResetableApplication from '../tests/ResetableApplication/ResetableApplication';
import LobbyFacade from './LobbyFacade';

describe('LobbyFacade', () => {
	let mocketServer: any;
	let mockedSocketA: any;
	let sessionA: ISession;
	let mockedSocketB: any;
	let sessionB: ISession;

	beforeEach(() => {
		ResetableApplication.reset();
		mocketServer = new MocketServer();
		Application.getInstance().bindServer(mocketServer)
		sessionA = Application.getSessionStorage().generate();
		mockedSocketA = mocketServer.of('/lobby').createSocket({
			sessionId: sessionA.sessionId,
		});
		Application.getPlayerIdSessionIdStorage().set(sessionA.playerId, sessionA.sessionId);
		sessionB = Application.getSessionStorage().generate();
		mockedSocketB = mocketServer.of('/lobby').createSocket({
			sessionId: sessionB.sessionId,
		});

		Application.getPlayerIdSessionIdStorage().set(sessionB.playerId, sessionB.sessionId);
	})

	test('create should create a lobby in application', () => {
		expect(Application.getLobbyStorage().toArray().length).toBe(0);

		const lobby: Lobby = LobbyFacade.create(mockedSocketA);

		expect(Application.getLobbyStorage().get(lobby.id).hostPlayerId).toBe(SocketIdentifierService.getPlayerIdentifier(mockedSocketA));
		expect(Application.getLobbyStorage().toArray().length).toBe(1);
	})

	test('create should make socket join socket.io-room', () => {
		expect(mockedSocketA.rooms.size).toBe(0);

		const lobby: Lobby = LobbyFacade.create(mockedSocketA);

		expect(mockedSocketA.rooms.size).toBe(1);
		expect(mockedSocketA.rooms.has(lobby.getSocketRoomName())).toBeTruthy();
	})

	test('create should link player to lobby', () => {
		const sessionIdOfSocketA = SocketIdentifierService.getSessionIdentifier(mockedSocketA);
		expect(Application.getPlayerLobbyStorage().get(sessionIdOfSocketA)).toBeUndefined();

		const lobby: Lobby = LobbyFacade.create(mockedSocketA);

		expect(Application.getPlayerLobbyStorage().get(sessionIdOfSocketA)).toBe(lobby.id);
	})

	test('join should add player to lobby', () => {
		const lobby: Lobby = LobbyFacade.create(mockedSocketA);

		expect(lobby.players.length).toBe(1);
		expect(lobby.isPlayerPresent(sessionA.playerId)).toBeTruthy();

		LobbyFacade.join(mockedSocketB, lobby.id);

		expect(lobby.players.length).toBe(2);
		expect(lobby.isPlayerPresent(sessionA.playerId)).toBeTruthy();
		expect(lobby.isPlayerPresent(sessionB.playerId)).toBeTruthy();
	})

	test('join should make socket join socket.io-room', () => {
		const lobby: Lobby = LobbyFacade.create(mockedSocketA);
		expect(mockedSocketB.rooms.size).toBe(0);

		LobbyFacade.join(mockedSocketB, lobby.id);

		expect(mockedSocketB.rooms.size).toBe(1);
		expect(mockedSocketB.rooms.has(Lobby.getLobbyName(lobby.id))).toBeTruthy()
	})

	test('join should link player to lobby', () => {
		const sessionIdOfSocketB = SocketIdentifierService.getSessionIdentifier(mockedSocketB);
		expect(Application.getPlayerLobbyStorage().get(sessionIdOfSocketB)).toBeUndefined();

		const lobby: Lobby = LobbyFacade.create(mockedSocketA);
		LobbyFacade.join(mockedSocketB, lobby.id);

		expect(Application.getPlayerLobbyStorage().get(sessionIdOfSocketB)).toBe(lobby.id);
	})

	test('rejoin should make socket join socket.io-room', () => {
		const lobby: Lobby = LobbyFacade.create(mockedSocketA);
		expect(mockedSocketB.rooms.size).toBe(0);

		LobbyFacade.join(mockedSocketB, lobby.id);

		expect(mockedSocketB.rooms.size).toBe(1);

		mockedSocketB.disconnect();

		const reconnectedMockedSocketB: any = mocketServer.of('/lobby').createSocket();
		reconnectedMockedSocketB.handshake = {
			auth: {
				sessionId: sessionB.sessionId,
			},
		}

		expect(reconnectedMockedSocketB.rooms.size).toBe(0);
		expect(SocketIdentifierService.getSessionIdentifier(mockedSocketB))
			.toBe(SocketIdentifierService.getSessionIdentifier(reconnectedMockedSocketB));

		LobbyFacade.rejoin(reconnectedMockedSocketB);

		expect(reconnectedMockedSocketB.rooms.size).toBe(1);
		expect(reconnectedMockedSocketB.rooms.has(lobby.getSocketRoomName())).toBeTruthy();
	})

	test('kick should work and make socket leave socket.io-room', () => {
		expect(mockedSocketA.rooms.size).toBe(0);

		const lobby: Lobby = LobbyFacade.create(mockedSocketA);

		expect(mockedSocketA.rooms.size).toBe(1);
		expect(mockedSocketA.rooms.has(lobby.getSocketRoomName())).toBeTruthy()
		expect(lobby.players.length).toBe(1);
		expect(lobby.isPlayerPresent(sessionA.playerId)).toBeTruthy();

		LobbyFacade.join(mockedSocketB, lobby.id);

		expect(lobby.players.length).toBe(2);
		expect(lobby.isPlayerPresent(sessionA.playerId)).toBeTruthy();
		expect(lobby.isPlayerPresent(sessionB.playerId)).toBeTruthy();
		expect(mockedSocketB.rooms.size).toBe(1);
		expect(mockedSocketB.rooms.has(lobby.getSocketRoomName())).toBeTruthy()

		LobbyFacade.kick(mockedSocketA, sessionB.playerId);

		expect(lobby.isPlayerPresent(sessionB.playerId)).toBeFalsy();
	})

	test('quit should leave player from lobby', () => {
		const lobby: Lobby = LobbyFacade.create(mockedSocketA);
		expect(lobby.players.length).toBe(1);
		expect(lobby.isPlayerPresent(sessionA.playerId)).toBeTruthy();

		LobbyFacade.join(mockedSocketB, lobby.id);
		expect(lobby.players.length).toBe(2);
		expect(lobby.isPlayerPresent(sessionA.playerId)).toBeTruthy();
		expect(lobby.isPlayerPresent(sessionB.playerId)).toBeTruthy();

		LobbyFacade.quit(mockedSocketB);
		expect(lobby.isPlayerPresent(sessionB.playerId)).toBeFalsy();
	})

	test('quit should unlink player from lobby', () => {
		const lobby: Lobby = LobbyFacade.create(mockedSocketA);
		expect(lobby.players.length).toBe(1);
		expect(lobby.isPlayerPresent(sessionA.playerId)).toBeTruthy();

		LobbyFacade.join(mockedSocketB, lobby.id);
		expect(lobby.players.length).toBe(2);
		expect(lobby.isPlayerPresent(sessionA.playerId)).toBeTruthy();
		expect(lobby.isPlayerPresent(sessionB.playerId)).toBeTruthy();

		LobbyFacade.quit(mockedSocketB);
		expect(lobby.isPlayerPresent(sessionB.playerId)).toBeFalsy();

		expect(Application.getPlayerLobbyStorage().get(mockedSocketB)).toBeUndefined();
	})

	test('quit should reassign host if host left', () => {
		const lobby: Lobby = LobbyFacade.create(mockedSocketA);
		expect(lobby.hostPlayerId).toBe(SocketIdentifierService.getPlayerIdentifier(mockedSocketA));

		LobbyFacade.join(mockedSocketB, lobby.id);
		expect(lobby.hostPlayerId).toBe(SocketIdentifierService.getPlayerIdentifier(mockedSocketA));
		LobbyFacade.quit(mockedSocketA);

		expect(lobby.hostPlayerId).toBe(SocketIdentifierService.getPlayerIdentifier(mockedSocketB));
	})

	test('startVote should emit start-vote event to everyone in room', () => {
		const lobby: Lobby = LobbyFacade.create(mockedSocketA);
		console.log(mockedSocketA.receivedEvents);
		expect(mockedSocketA.receivedEvents.filter(e => e.name === 'update-lobby').length).toBe(0);
		expect(mockedSocketB.receivedEvents.filter(e => e.name === 'update-lobby').length).toBe(0);

		LobbyFacade.join(mockedSocketB, lobby.id);
		expect(mockedSocketA.receivedEvents.filter(e => e.name === 'update-lobby').length).toBe(1);
		expect(mockedSocketB.receivedEvents.filter(e => e.name === 'update-lobby').length).toBe(0);

		LobbyFacade.startVote(mockedSocketA, 3);
		expect(mockedSocketA.receivedEvents.filter(e => e.name === 'update-lobby' || e.name === 'vote-started').length).toBe(2);
		expect(mockedSocketB.receivedEvents.filter(e => e.name === 'update-lobby' || e.name === 'vote-started').length).toBe(1);
	})
});