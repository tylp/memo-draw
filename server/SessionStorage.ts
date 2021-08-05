import Profile from "./interfaces/IProfile";
import ISession from "./interfaces/ISession";
import IdGeneratorService from "./services/IdGeneratorService";

export default class SessionStorage {
	sessions;

	constructor() {
		this.sessions = new Map();
	}

	getNewSession(): ISession {
		const sessionId = IdGeneratorService.generate();
		const playerId = IdGeneratorService.generate();
		return this.saveSession(sessionId, { sessionId, playerId });
	}

	findSession(id: string): ISession {
		return this.sessions.get(id);
	}

	saveSession(id: string, session: ISession): ISession {
		this.sessions.set(id, session);
		return session;
	}

	updateSession(id: string, data: ISession): void {
		const session = this.findSession(id);
		this.saveSession(id, { ...session, ...data });
	}

	setSessionRoomID(id: string, roomID: string): void {
		const session = this.findSession(id);
		this.sessions.set(id, { ...session, roomID: roomID });
	}

	findAllSessions(): Array<ISession> {
		return [...this.sessions.values()];
	}

	updateProfile(id: string, profile: Profile): void {
		this.updateSession(id, {
			profile
		})
	}

	exists(sessionId: string): boolean {
		return this.sessions.has(sessionId);
	}
}