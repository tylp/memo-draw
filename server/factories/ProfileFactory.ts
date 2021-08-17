import { BodyColor, BodyType, FaceType } from './../interfaces/IProfile';
import IProfile, { RubberColor } from "../interfaces/IProfile";
import FakeNameGeneratorService from "../services/FakeNameGeneratorService";
import RandomEnumPickerService from "../services/RandomEnumPickerService";

export default class ProfileFactory {
    static create(): IProfile {
        return {
            username: FakeNameGeneratorService.generate(),
            avatar: {
                rubberColor: RandomEnumPickerService.pick(RubberColor),
                bodyType: RandomEnumPickerService.pick(BodyType),
                bodyColor: RandomEnumPickerService.pick(BodyColor),
                faceType: RandomEnumPickerService.pick(FaceType),
            }
        }
    }
}