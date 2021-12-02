import SessionStorage from './SessionStorage';
import AvatarFactory from '../../factories/AvatarFactory';

describe('SessionStorage', () => {
	let storage = new SessionStorage();

	beforeEach(() => {
		storage = new SessionStorage();
	})

	test('generate should work', () => {
		expect(storage.isEmpty()).toBeTruthy()
		const session = storage.generate();
		expect(session).toHaveProperty('sessionId');
		expect(session).toHaveProperty('playerId');
		expect(session).toHaveProperty('profile');
		expect(session.profile).toHaveProperty('username');
		expect(session.profile.avatar).toHaveProperty('rubberColor');
		expect(session.profile.avatar).toHaveProperty('bodyColor');
		expect(session.profile.avatar).toHaveProperty('faceType');
	});

	test('update should work', () => {
		let session = storage.generate();
		expect(session).toBe(storage.get(session.sessionId));
		const newUsername = 'New username';

		storage.update(session.sessionId, {
			profile: {
				username: newUsername,
				avatar: AvatarFactory.create(),
			},
		});

		session = storage.get(session.sessionId);

		expect(session.profile.username).toBe(newUsername);
	});
});