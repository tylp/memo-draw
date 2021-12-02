import { IAvatar } from '../interfaces/IAvatar';
import { BodyColor, RubberColor, BodyType, FaceType } from '../interfaces/IProfile';
import RandomEnumPickerService from '../services/RandomEnumPickerService';

export default class AvatarFactory {
	static create(): IAvatar {
		return {
			rubberColor: RandomEnumPickerService.pick(RubberColor),
			bodyType: RandomEnumPickerService.pick(BodyType),
			bodyColor: RandomEnumPickerService.pick(BodyColor),
			faceType: RandomEnumPickerService.pick(FaceType),
		}
	}
}