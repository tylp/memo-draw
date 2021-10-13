import PlayerFactory from '../../factories/PlayerFactory';
import ProfileFactory from '../../factories/ProfileFactory';
import RoomFactory from '../../factories/RoomFactory';
import RoomStorage from './RoomStorage';
import IdGeneratorService from '../../services/IdGeneratorService';
import ISession from '../../interfaces/ISession';

describe('RoomStorage', () => {
	let storage = new RoomStorage();
	const roomIdNotExisting = IdGeneratorService.generate();
	const playerOneSession: ISession = {
		sessionId: 'Random string',
		playerId: 'Random string',
		profile: ProfileFactory.create()
	}
	const roomId = IdGeneratorService.generate();
	let room = RoomFactory.create(playerOneSession.playerId);
	const playerOne = PlayerFactory.create(playerOneSession);

	const playerTwoSession: ISession = {
		sessionId: 'Random string #2',
		playerId: 'Random string #2',
		profile: ProfileFactory.create()
	}
	const playerTwo = PlayerFactory.create(playerTwoSession);

	beforeEach(() => {
		storage = new RoomStorage();
		room = RoomFactory.create(playerOneSession.playerId);
		storage.set(roomId, room)
	})

	test('isPlayerPresent should work', () => {
		expect(storage.isPlayerPresent(roomId, playerOne)).toBeFalsy();

		storage.addPlayer(roomId, playerOne);

		expect(storage.isPlayerPresent(roomId, playerOne)).toBeTruthy();
	});

	test('isPlayerPresent should not crash when room is not found', () => {
		expect(storage.isPlayerPresent(roomIdNotExisting, playerOne)).toBeFalsy()
	});

	test('addPlayer should work', () => {
		expect(storage.get(roomId).isEmpty()).toBeTruthy();

		storage.addPlayer(roomId, playerOne);

		expect(storage.isEmpty()).toBeFalsy();
		expect(storage.get(roomId).isPlayerPresent(playerOne)).toBeTruthy();

		storage.addPlayer(roomId, playerTwo);

		expect(storage.isEmpty()).toBeFalsy();
		expect(storage.get(roomId).isPlayerPresent(playerOne)).toBeTruthy();
		expect(storage.get(roomId).isPlayerPresent(playerTwo)).toBeTruthy();
	});

	test('addPlayer should not crash when room is not found', () => {
		expect(storage.addPlayer(roomIdNotExisting, playerOne)).toBeFalsy()
	});

	test('removePlayer should work', () => {
		expect(storage.get(roomId).isEmpty()).toBeTruthy();

		storage.addPlayer(roomId, playerOne);
		storage.addPlayer(roomId, playerTwo);
		expect(storage.get(roomId).isEmpty()).toBeFalsy();
		expect(storage.isPlayerPresent(roomId, playerOne)).toBeTruthy();
		expect(storage.isPlayerPresent(roomId, playerTwo)).toBeTruthy();

		storage.removePlayer(roomId, playerOne.id);
		expect(storage.get(roomId).isEmpty()).toBeFalsy();
		expect(storage.isPlayerPresent(roomId, playerOne)).toBeFalsy();
		expect(storage.isPlayerPresent(roomId, playerTwo)).toBeTruthy();

		storage.removePlayer(roomId, playerTwo.id);
		expect(storage.get(roomId).isEmpty()).toBeTruthy();
		expect(storage.isPlayerPresent(roomId, playerOne)).toBeFalsy();
		expect(storage.isPlayerPresent(roomId, playerTwo)).toBeFalsy();
	});

	test('removePlayer should not crash when room is not found', () => {
		expect(storage.removePlayer(roomIdNotExisting, playerOne.id)).toBeFalsy()
	});
});