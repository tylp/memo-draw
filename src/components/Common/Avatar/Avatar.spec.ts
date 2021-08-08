import { RubberColor } from "../../../../server/interfaces/IProfile";
import { BodyColor } from "../../../../server/interfaces/IProfile";
import { FaceType } from "../../../../server/interfaces/IProfile";

export interface IAvatar {
    RubberColor: RubberColor,
    BodyColor: BodyColor,
    FaceType: FaceType,
}
