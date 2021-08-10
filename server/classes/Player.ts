import Profile from "../interfaces/IProfile";
import ISession from "../interfaces/ISession";

export default class Player {
    id: string;
    profile: Profile;

    constructor(session: ISession) {
        this.id = session.playerId;
        this.profile = session.profile;
    }
}