import type Player from '../classes/Player';
import { BodyColor, BodyType, FaceType, RubberColor } from './IProfile';

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
