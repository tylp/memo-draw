import IProfile from "../interfaces/IProfile";
import ISession from "../interfaces/ISession";

export default class Player {
    id: string;
    profile: IProfile;

    constructor(session: ISession) {
        this.id = session.playerId;
        this.profile = session.profile;
    }
}