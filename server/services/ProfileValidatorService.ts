import { BodyColor, RubberColor, BodyType, FaceType } from './../interfaces/IProfile';
import { IAvatar } from 'server/interfaces/IAvatar';
import IProfile from '../interfaces/IProfile';
import { EnumToArray } from './EnumToArray/EnumToArray';

const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 16;

export default class ProfileValidatorService {
	public static validate(profile: IProfile): boolean {
		return this.validateUsername(profile?.username)
			&& this.validateAvatar(profile?.avatar);
	}

	public static validateUsername(username: string): boolean {
		return username?.length >= MIN_USERNAME_LENGTH
			&& username?.length <= MAX_USERNAME_LENGTH;
	}

	public static validateAvatar(avatar: IAvatar): boolean {
		return !!(avatar
			&& this.validateBodyColor(avatar.bodyColor)
			&& this.validateBodyType(avatar.bodyType)
			&& this.validateFaceType(avatar.faceType)
			&& this.validateRubberColor(avatar.rubberColor)
		);
	}

	protected static validateBodyColor(bodyColor: BodyColor): boolean {
		const bodyColors = EnumToArray.treat(BodyColor);

		return bodyColor && bodyColors.includes(bodyColor);
	}

	protected static validateBodyType(bodyType: BodyType): boolean {
		const bodyTypes = EnumToArray.treat(BodyType);

		return bodyType && bodyTypes.includes(bodyType);
	}

	protected static validateFaceType(faceType: FaceType): boolean {
		const faceTypes = EnumToArray.treat(FaceType);

		return faceType && faceTypes.includes(faceType);
	}

	protected static validateRubberColor(rubberColor: RubberColor): boolean {
		const rubberColors = EnumToArray.treat(RubberColor);

		return rubberColor && rubberColors.includes(rubberColor);
	}
}
