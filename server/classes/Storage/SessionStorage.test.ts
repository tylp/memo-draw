import { FaceType, RubberColor } from './../../interfaces/IProfile';
import { BodyColor } from "../../interfaces/IProfile";
import SessionStorage from "./SessionStorage";

describe("SessionStorage", () => {
	let storage = new SessionStorage();
	
    beforeEach(() => {
        storage = new SessionStorage();
    })

	test("generate should work", () => {
        expect(storage.isEmpty()).toBeTruthy()
        const session = storage.generate();
        expect(session).toHaveProperty("sessionId");
        expect(session).toHaveProperty("playerId");
        expect(session).toHaveProperty("profile");
        expect(session.profile).toHaveProperty("username");
        expect(session.profile).toHaveProperty("rubberColor");
        expect(session.profile).toHaveProperty("bodyColor");
        expect(session.profile).toHaveProperty("faceType");
	});

	test("update should work", () => {
        let session = storage.generate();
        expect(session).toBe(storage.get(session.sessionId));
        const newUsername = "New username";

        storage.update(session.sessionId, {
            profile: {
            username: newUsername,
            bodyColor: BodyColor.Blue,
            faceType: FaceType.Astonished,
            rubberColor: RubberColor.Blue,
        }});
        
        session = storage.get(session.sessionId);

        expect(session.profile.username).toBe(newUsername);
	});
});