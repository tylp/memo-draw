import { FaceType, BodyType } from "../../server/interfaces/IProfile";

export default class AvatarService {
	public static getBody(bodyType: BodyType): unknown {
		return require(`../avatars/body/${bodyType}`);
	}

	public static getFaceType(faceType: FaceType): unknown {
		return require(`../avatars/expression/${faceType}`);
	}
}