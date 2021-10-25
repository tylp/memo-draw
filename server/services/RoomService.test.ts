import Application from '../classes/Application';
import ISession from '../interfaces/ISession';
import RoomService from './RoomService';

class ResetableApplication extends Application {
	static reset() {
		Application.instance = new Application();
	}
}

describe('RoomService', () => {
	let session: ISession = Application.getSessionStorage().generate();

	beforeEach(() => {
		session = Application.getSessionStorage().generate();
		ResetableApplication.reset();
	});

	test('RoomService create should work', () => {
		expect(Application.getPlayerRoomStorage().get(session.sessionId)).toBeUndefined();
		expect(Application.getRoomStorage().isEmpty()).toBeTruthy();

		const newRoom = RoomService.create(session.sessionId);

		expect(Application.getPlayerRoomStorage().get(session.sessionId)).toBe(newRoom.id);
		expect(Application.getRoomStorage().isEmpty()).toBeFalsy();
	});
});