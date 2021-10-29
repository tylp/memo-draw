import PlayerFactory from '../../factories/PlayerFactory';
import ProfileFactory from '../../factories/ProfileFactory';
import LobbyFactory from '../../factories/LobbyFactory';
import LobbyStorage from './LobbyStorage';
import IdGeneratorService from '../../services/IdGeneratorService';
import ISession from '../../interfaces/ISession';

describe('LobbyStorage', () => {
	let storage = new LobbyStorage();
	const lobbyIdNotExisting = IdGeneratorService.generate();
	const playerOneSession: ISession = {
		sessionId: 'Random string',
		playerId: 'Random string',
		profile: ProfileFactory.create(),
	}
	const lobbyId = IdGeneratorService.generate();
	let lobby = LobbyFactory.create(playerOneSession.playerId);
	const playerOne = PlayerFactory.create(playerOneSession);

	const playerTwoSession: ISession = {
		sessionId: 'Random string #2',
		playerId: 'Random string #2',
		profile: ProfileFactory.create(),
	}
	const playerTwo = PlayerFactory.create(playerTwoSession);

	beforeEach(() => {
		storage = new LobbyStorage();
		lobby = LobbyFactory.create(playerOneSession.playerId);
		storage.set(lobbyId, lobby)
	})

	test('isPlayerPresent should work', () => {
		expect(storage.isPlayerPresent(lobbyId, playerOne)).toBeFalsy();

		storage.addPlayer(lobbyId, playerOne);

		expect(storage.isPlayerPresent(lobbyId, playerOne)).toBeTruthy();
	});

	test('isPlayerPresent should not crash when lobby is not found', () => {
		expect(storage.isPlayerPresent(lobbyIdNotExisting, playerOne)).toBeFalsy()
	});

	test('addPlayer should work', () => {
		expect(storage.get(lobbyId).isEmpty()).toBeTruthy();

		storage.addPlayer(lobbyId, playerOne);

		expect(storage.isEmpty()).toBeFalsy();
		expect(storage.get(lobbyId).isPlayerPresent(playerOne.id)).toBeTruthy();

		storage.addPlayer(lobbyId, playerTwo);

		expect(storage.isEmpty()).toBeFalsy();
		expect(storage.get(lobbyId).isPlayerPresent(playerOne.id)).toBeTruthy();
		expect(storage.get(lobbyId).isPlayerPresent(playerTwo.id)).toBeTruthy();
	});

	test('addPlayer should not crash when lobby is not found', () => {
		expect(storage.addPlayer(lobbyIdNotExisting, playerOne)).toBeFalsy()
	});

	test('removePlayer should work', () => {
		expect(storage.get(lobbyId).isEmpty()).toBeTruthy();

		storage.addPlayer(lobbyId, playerOne);
		storage.addPlayer(lobbyId, playerTwo);
		expect(storage.get(lobbyId).isEmpty()).toBeFalsy();
		expect(storage.isPlayerPresent(lobbyId, playerOne)).toBeTruthy();
		expect(storage.isPlayerPresent(lobbyId, playerTwo)).toBeTruthy();

		storage.removePlayer(lobbyId, playerOne.id);
		expect(storage.get(lobbyId).isEmpty()).toBeFalsy();
		expect(storage.isPlayerPresent(lobbyId, playerOne)).toBeFalsy();
		expect(storage.isPlayerPresent(lobbyId, playerTwo)).toBeTruthy();

		storage.removePlayer(lobbyId, playerTwo.id);
		expect(storage.get(lobbyId).isEmpty()).toBeTruthy();
		expect(storage.isPlayerPresent(lobbyId, playerOne)).toBeFalsy();
		expect(storage.isPlayerPresent(lobbyId, playerTwo)).toBeFalsy();
	});

	test('removePlayer should not crash when lobby is not found', () => {
		expect(storage.removePlayer(lobbyIdNotExisting, playerOne.id)).toBeFalsy()
	});
});