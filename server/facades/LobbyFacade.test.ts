/* eslint-disable @typescript-eslint/no-explicit-any */
import { MocketServer } from 'mockets.io/dist/classes/Server/MocketServer';
import Application from '../classes/Application';
import Room from '../classes/Room';
import ISession from '../interfaces/ISession';
import SocketIdentifierService from '../services/SocketIdentifierService';
import ResetableApplication from '../tests/ResetableApplication/ResetableApplication';
import LobbyFacade from './LobbyFacade';

describe('LobbyFacade', () => {
	let mocketServer: MocketServer;
	let mockedSocketA: any;
	let sessionA: ISession;
	let mockedSocketB: any;
	let sessionB: ISession;

	beforeEach(() => {
		ResetableApplication.reset();
		mocketServer = new MocketServer();
		mockedSocketA = mocketServer.createSocket();
		sessionA = Application.getSessionStorage().generate();
		mockedSocketA.handshake = {
			auth: {
				sessionId: sessionA.sessionId,
			},
		}
		Application.getPlayerIdSessionIdStorage().set(sessionA.playerId, sessionA.sessionId);
		mockedSocketB = mocketServer.createSocket();
		sessionB = Application.getSessionStorage().generate();
		mockedSocketB.handshake = {
			auth: {
				sessionId: sessionB.sessionId,
			},
		}
		Application.getPlayerIdSessionIdStorage().set(sessionB.playerId, sessionB.sessionId);
	})

	test('create should create a room in application', () => {
		expect(Application.getLobbyStorage().toArray().length).toBe(0);

		const room: Room = LobbyFacade.create(mockedSocketA);

		expect(Application.getLobbyStorage().get(room.id).hostPlayerId).toBe(SocketIdentifierService.getPlayerIdentifier(mockedSocketA));
		expect(Application.getLobbyStorage().toArray().length).toBe(1);
	})

	test('create should make socket join socket.io-room', () => {
		expect(mockedSocketA.rooms.size).toBe(0);

		const room: Room = LobbyFacade.create(mockedSocketA);

		expect(mockedSocketA.rooms.size).toBe(1);
		expect(mockedSocketA.rooms.has(room.getSocketRoomName())).toBeTruthy();
	})

	test('create should link player to lobby', () => {
		const sessionIdOfSocketA = SocketIdentifierService.getSessionIdentifier(mockedSocketA);
		expect(Application.getPlayerLobbyStorage().get(sessionIdOfSocketA)).toBeUndefined();

		const room: Room = LobbyFacade.create(mockedSocketA);

		expect(Application.getPlayerLobbyStorage().get(sessionIdOfSocketA)).toBe(room.id);
	})

	test('join should add player to room', () => {
		const room: Room = LobbyFacade.create(mockedSocketA);

		expect(room.players.length).toBe(1);
		expect(room.isPlayerPresent(sessionA.playerId)).toBeTruthy();

		LobbyFacade.join(mockedSocketB, room.id);

		expect(room.players.length).toBe(2);
		expect(room.isPlayerPresent(sessionA.playerId)).toBeTruthy();
		expect(room.isPlayerPresent(sessionB.playerId)).toBeTruthy();
	})

	test('join should make socket join socket.io-room', () => {
		const room: Room = LobbyFacade.create(mockedSocketA);
		expect(mockedSocketB.rooms.size).toBe(0);

		LobbyFacade.join(mockedSocketB, room.id);

		expect(mockedSocketB.rooms.size).toBe(1);
		expect(mockedSocketB.rooms.has(Room.getRoomName(room.id))).toBeTruthy()
	})

	test('join should link player to lobby', () => {
		const sessionIdOfSocketB = SocketIdentifierService.getSessionIdentifier(mockedSocketB);
		expect(Application.getPlayerLobbyStorage().get(sessionIdOfSocketB)).toBeUndefined();

		const room: Room = LobbyFacade.create(mockedSocketA);
		LobbyFacade.join(mockedSocketB, room.id);

		expect(Application.getPlayerLobbyStorage().get(sessionIdOfSocketB)).toBe(room.id);
	})

	test('rejoin should make socket join socket.io-room', () => {
		const room: Room = LobbyFacade.create(mockedSocketA);
		expect(mockedSocketB.rooms.size).toBe(0);

		LobbyFacade.join(mockedSocketB, room.id);

		expect(mockedSocketB.rooms.size).toBe(1);

		mockedSocketB.disconnect();

		const reconnectedMockedSocketB: any = mocketServer.createSocket();
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
		expect(reconnectedMockedSocketB.rooms.has(room.getSocketRoomName())).toBeTruthy();
	})

	test('kick should work and make socket leave socket.io-room', () => {
		expect(mockedSocketA.rooms.size).toBe(0);

		const room: Room = LobbyFacade.create(mockedSocketA);

		expect(mockedSocketA.rooms.size).toBe(1);
		expect(mockedSocketA.rooms.has(room.getSocketRoomName())).toBeTruthy()
		expect(room.players.length).toBe(1);
		expect(room.isPlayerPresent(sessionA.playerId)).toBeTruthy();

		LobbyFacade.join(mockedSocketB, room.id);

		expect(room.players.length).toBe(2);
		expect(room.isPlayerPresent(sessionA.playerId)).toBeTruthy();
		expect(room.isPlayerPresent(sessionB.playerId)).toBeTruthy();
		expect(mockedSocketB.rooms.size).toBe(1);
		expect(mockedSocketB.rooms.has(room.getSocketRoomName())).toBeTruthy()

		LobbyFacade.kick(mockedSocketA, sessionB.playerId);

		expect(room.isPlayerPresent(sessionB.playerId)).toBeFalsy();
	})

	test('quit should leave player from lobby', () => {
		const room: Room = LobbyFacade.create(mockedSocketA);
		expect(room.players.length).toBe(1);
		expect(room.isPlayerPresent(sessionA.playerId)).toBeTruthy();

		LobbyFacade.join(mockedSocketB, room.id);
		expect(room.players.length).toBe(2);
		expect(room.isPlayerPresent(sessionA.playerId)).toBeTruthy();
		expect(room.isPlayerPresent(sessionB.playerId)).toBeTruthy();

		LobbyFacade.quit(mockedSocketB);
		expect(room.isPlayerPresent(sessionB.playerId)).toBeFalsy();
	})

	test('quit should delink player from lobby', () => {
		const room: Room = LobbyFacade.create(mockedSocketA);
		expect(room.players.length).toBe(1);
		expect(room.isPlayerPresent(sessionA.playerId)).toBeTruthy();

		LobbyFacade.join(mockedSocketB, room.id);
		expect(room.players.length).toBe(2);
		expect(room.isPlayerPresent(sessionA.playerId)).toBeTruthy();
		expect(room.isPlayerPresent(sessionB.playerId)).toBeTruthy();

		LobbyFacade.quit(mockedSocketB);
		expect(room.isPlayerPresent(sessionB.playerId)).toBeFalsy();

		expect(Application.getPlayerLobbyStorage().get(mockedSocketB)).toBeUndefined();
	})

	test('quit should reassign host if host left', () => {
		const room: Room = LobbyFacade.create(mockedSocketA);
		expect(room.hostPlayerId).toBe(SocketIdentifierService.getPlayerIdentifier(mockedSocketA));

		LobbyFacade.join(mockedSocketB, room.id);
		expect(room.hostPlayerId).toBe(SocketIdentifierService.getPlayerIdentifier(mockedSocketA));
		LobbyFacade.quit(mockedSocketA);

		expect(room.hostPlayerId).toBe(SocketIdentifierService.getPlayerIdentifier(mockedSocketB));
	})
});