import Application from '../classes/Application';
import ISession from '../interfaces/ISession';
import RoomService from './RoomService';

class ResetableApplication extends Application {
	static reset() {
		Application.instance = new Application();
	}
}

describe('RoomService', () => {
	let sessionA: ISession = Application.getSessionStorage().generate();
	let sessionIdA = sessionA.sessionId;
	let playerIdA = sessionA.playerId;

	beforeEach(() => {
		ResetableApplication.reset();
		sessionA = Application.getSessionStorage().generate();
		sessionIdA = sessionA.sessionId;
		playerIdA = sessionA.playerId;
	});

	test('RoomService create should work', () => {

		expect(Application.getPlayerRoomStorage().get(sessionIdA)).toBeUndefined();
		expect(Application.getRoomStorage().isEmpty()).toBeTruthy();

		const newRoom = RoomService.create({ playerId: playerIdA, sessionId: sessionIdA });

		expect(Application.getPlayerRoomStorage().get(sessionIdA)).toBe(newRoom.id);
		expect(Application.getRoomStorage().isEmpty()).toBeFalsy();
		expect(newRoom.hostPlayerId).toBe(playerIdA);
	});

	test('RoomService quit should work', () => {
		expect(Application.getPlayerRoomStorage().get(sessionIdA)).toBeUndefined();
		expect(Application.getRoomStorage().isEmpty()).toBeTruthy();

		const newRoom = RoomService.create({ playerId: playerIdA, sessionId: sessionIdA });

		expect(Application.getPlayerRoomStorage().get(sessionIdA)).toBe(newRoom.id);
		expect(Application.getRoomStorage().isEmpty()).toBeFalsy();
		expect(newRoom.hostPlayerId).toBe(playerIdA);

		const quittedRoom = RoomService.quit({ playerId: playerIdA, sessionId: sessionIdA })

		expect(Application.getPlayerRoomStorage().get(sessionIdA)).toBeUndefined();
		expect(Application.getRoomStorage().isEmpty()).toBeFalsy();
		expect(quittedRoom.hostPlayerId).toBeUndefined();
	});
});