import { RubberColor, BodyColor, FaceType, BodyType } from "../../server/interfaces/IProfile";
import Pencil from "../avatars/body/pencil.svg";

export default class AvatarService {

    public static getBody(bodyType: BodyType) {
        switch(bodyType) {
            case BodyType.Pencil:
                return Pencil;
            default:
                return Pencil;
        }
    }

    public static getFaceType(faceType: FaceType) {
        return require(`../avatars/expression/${FaceType[faceType]}.svg`);
    }
}