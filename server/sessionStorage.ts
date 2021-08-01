export default class SessionStorage {
	sessions;
	constructor() {
		this.sessions = new Map();
	}

	findSession(id: string):any {
		return this.sessions.get(id);
	}

	saveSession(id:string, session:any):void {
	    this.sessions.set(id, session);
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
}