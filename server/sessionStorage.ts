import IdGeneratorService from "./services/IdGeneratorService";

export default class SessionStorage {
	sessions;

	constructor() {
		this.sessions = new Map();
	}

	getNewSession(): any {
		const sessionID = IdGeneratorService.generate();
		return this.saveSession(sessionID, { sessionID });
	}

	findSession(id: string):any {
		return this.sessions.get(id);
	}

	saveSession(id:string, session: any):void {
	    this.sessions.set(id, session);
		return session;
	}

	updateSession(id: string, data: any): void {
		const session = this.findSession(id);
		this.saveSession(id, {...session, ...data});
	}

    setSessionRoomID(id:string, roomID:string):void {
        const session = this.findSession(id);
        this.sessions.set(id, {...session, roomID: roomID});
    }

	findAllSessions():Array<any>{
		return [...this.sessions.values()];
	}

    findAllSessionsOfRoom(roomID):any{
        const room = [];
        for(const session of this.sessions.values()){
            if(session.roomID === roomID){
                room.push(session);
            }
        }
		return room;
	}

	updateProfile(id: string, profile: any): void {
		this.updateSession(id, {
			profile
		})
	}
}