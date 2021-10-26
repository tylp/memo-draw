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

	test('rejoin should work', () => {
		throw Error('No test.');
	})

	test('kick should work', () => {
		throw Error('No test.');
	})

	test('quit should work', () => {
		throw Error('No test.');
	})
});