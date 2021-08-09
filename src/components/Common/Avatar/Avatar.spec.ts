import { RubberColor, BodyType, BodyColor, FaceType } from "../../../../server/interfaces/IProfile";

export interface IAvatar {
    rubberColor: RubberColor,
    bodyType: BodyType,
    bodyColor: BodyColor,
    faceType: FaceType,
}

export interface IBody {
    type: BodyType,
    color: BodyColor,
}

export interface IFace {
    type: FaceType,
}
