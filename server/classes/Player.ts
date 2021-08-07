import Profile from "../interfaces/IProfile";

export default class Player {
    id: string;
    profile: Profile;

    constructor(id: string, profile: Profile) {
        this.id = id;
        this.profile = profile;
    }
}