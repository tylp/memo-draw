import { FaceType, BodyType } from "../../server/interfaces/IProfile";

export default class AvatarService {
	public static getBody(bodyType: BodyType): {default: {
		src
	}} {
		return require(`../avatars/body/${bodyType}`);
	}

	public static getFaceType(faceType: FaceType): {default: {
		src
	}} {
		return require(`../avatars/expression/${faceType}`);
	}
}