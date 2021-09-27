import Player from '../../../../server/classes/Player';
import { RubberColor, BodyType, BodyColor, FaceType } from '../../../../server/interfaces/IProfile';

export interface AvatarSpecs {
	avatar: IAvatar;
}

export interface IAvatar {
	rubberColor: RubberColor,
	bodyType: BodyType,
	bodyColor: BodyColor,
	faceType: FaceType,
}

export interface IBody {
	playerId?: Player['id'],
	type: BodyType,
	color: BodyColor,
}

export interface IFace {
	type: FaceType,
}
