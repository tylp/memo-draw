import SocketMock from 'socket.io-mock';
import Application from '../classes/Application';
import Room from '../classes/Room';
import ISession from '../interfaces/ISession';
import SocketIdentifierService from '../services/SocketIdentifierService';
import ResetableApplication from '../tests/ResetableApplication/ResetableApplication';
import MockedSocketFactory from '../tests/SocketMockFactory';
import RoomFacade from './RoomFacade';

describe('RoomFacade', () => {
	let mockedSocketA: SocketMock;
	let sessionA: ISession;
	let mockedSocketB: SocketMock;
	let sessionB: ISession;

	beforeEach(() => {
		ResetableApplication.reset();
		mockedSocketA = MockedSocketFactory.create();
		sessionA = SocketIdentifierService.getSessionOf(mockedSocketA);
		mockedSocketB = MockedSocketFactory.create();
		sessionB = SocketIdentifierService.getSessionOf(mockedSocketB);
	})

	test('create should create a room in application', () => {
		expect(Application.getRoomStorage().toArray().length).toBe(0);

		const room: Room = RoomFacade.create(mockedSocketA);

		expect(Application.getRoomStorage().get(room.id).hostPlayerId).toBe(SocketIdentifierService.getPlayerIdentifier(mockedSocketA));
		expect(Application.getRoomStorage().toArray().length).toBe(1);
	})

	test('create should make socket join socket.io-room', () => {
		expect(mockedSocketA.rooms.length).toBe(0);

		const room: Room = RoomFacade.create(mockedSocketA);

		expect(mockedSocketA.rooms.length).toBe(1);
		expect(mockedSocketA.rooms[0]).toBe(room.getSocketRoomName());
	})

	test('create should link player to lobby', () => {
		const sessionIdOfSocketA = SocketIdentifierService.getSessionIdentifier(mockedSocketA);
		expect(Application.getPlayerRoomStorage().get(sessionIdOfSocketA)).toBeUndefined();

		const room: Room = RoomFacade.create(mockedSocketA);

		expect(Application.getPlayerRoomStorage().get(sessionIdOfSocketA)).toBe(room.id);
	})

	test('join should add player to room', () => {
		const room: Room = RoomFacade.create(mockedSocketA);

		expect(room.players.length).toBe(1);
		expect(room.isPlayerPresent(sessionA.playerId)).toBeTruthy();

		RoomFacade.join(mockedSocketB, room.id);

		expect(room.players.length).toBe(2);
		expect(room.isPlayerPresent(sessionA.playerId)).toBeTruthy();
		expect(room.isPlayerPresent(sessionB.playerId)).toBeTruthy();
	})

	test('join should make socket join socket.io-room', () => {
		const room: Room = RoomFacade.create(mockedSocketA);
		expect(mockedSocketB.rooms.length).toBe(0);

		RoomFacade.join(mockedSocketB, room.id);

		expect(mockedSocketB.rooms.length).toBe(1);
	})

	test('join should link player to lobby', () => {
		const sessionIdOfSocketB = SocketIdentifierService.getSessionIdentifier(mockedSocketB);
		expect(Application.getPlayerRoomStorage().get(sessionIdOfSocketB)).toBeUndefined();

		const room: Room = RoomFacade.create(mockedSocketA);
		RoomFacade.join(mockedSocketB, room.id);

		expect(Application.getPlayerRoomStorage().get(sessionIdOfSocketB)).toBe(room.id);
	})

	test('rejoin should make socket join socket.io-room', () => {
		const room: Room = RoomFacade.create(mockedSocketA);
		expect(mockedSocketB.rooms.length).toBe(0);

		RoomFacade.join(mockedSocketB, room.id);

		expect(mockedSocketB.rooms.length).toBe(1);

		mockedSocketB.disconnect();

		const reconnectedMockedSocketB = MockedSocketFactory.create(sessionB);

		expect(reconnectedMockedSocketB.rooms.length).toBe(0);
		expect(SocketIdentifierService.getSessionIdentifier(mockedSocketB))
			.toBe(SocketIdentifierService.getSessionIdentifier(reconnectedMockedSocketB));

		RoomFacade.rejoin(reconnectedMockedSocketB);

		expect(reconnectedMockedSocketB.rooms.length).toBe(1);
	})

	test('rejoin should reassign host if no host are present', () => {
		throw Error('No test.');
	})

	test('kick should work', () => {
		throw Error('No test.');
	})

	test('quit should work', () => {
		throw Error('No test.');
	})

	test('disconnection should work', () => {
		throw Error('No test.');
	})
});