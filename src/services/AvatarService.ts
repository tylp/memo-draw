import { RubberColor, BodyColor, FaceType, BodyType } from "../../server/interfaces/IProfile";

export default class AvatarService {

    public static getBody(bodyType: BodyType) {
        return require(`../avatars/body/${BodyType[bodyType]}.svg`);
    }

    public static getFaceType(faceType: FaceType) {
        return require(`../avatars/expression/${FaceType[faceType]}.svg`);
    }
}