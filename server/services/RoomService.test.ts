import Application from '../classes/Application';
import IdGeneratorService from './IdGeneratorService';
import RoomService from './RoomService';

class ResetableApplication extends Application {
	static reset() {
		Application.instance = new Application();
	}
}

describe('RoomService', () => {
	const sessionId = IdGeneratorService.generate();
	const playerId = IdGeneratorService.generate();

	beforeEach(() => {
		ResetableApplication.reset();
	});

	test('RoomService create should work', () => {
		expect(Application.getPlayerRoomStorage().get(sessionId)).toBeUndefined();
		expect(Application.getRoomStorage().isEmpty()).toBeTruthy();

		const newRoom = RoomService.create(sessionId);

		expect(Application.getPlayerRoomStorage().get(sessionId)).toBe(newRoom.id);
		expect(Application.getRoomStorage().isEmpty()).toBeFalsy();
	});
});