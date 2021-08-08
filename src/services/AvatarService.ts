import { RubberColor, BodyColor, FaceType } from "../../server/interfaces/IProfile";

export default class AvatarService {
    public static getBody(bodyColor: BodyColor) {
        return require(`../avatars/body/pencil.svg`);
    }

    public static getFaceType(faceType: FaceType) {
        return require(`../avatars/expression/${FaceType[faceType]}.svg`);
    }
}