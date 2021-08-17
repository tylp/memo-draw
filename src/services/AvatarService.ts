import { FaceType, BodyType } from "../../server/interfaces/IProfile";

export default class AvatarService {
    public static getBody(bodyType: BodyType): NodeRequire {
        return require(`../avatars/body/${bodyType}`);
    }

    public static getFaceType(faceType: FaceType): NodeRequire {
        return require(`../avatars/expression/${faceType}`);
    }
}