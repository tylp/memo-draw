import { FaceType, BodyType } from "../../server/interfaces/IProfile";

export default class AvatarService {
    public static getBody(bodyType: BodyType): string {
        return require(`../avatars/body/${bodyType}`);
    }

    public static getFaceType(faceType: FaceType): string {
        return require(`../avatars/expression/${faceType}`);
    }
}