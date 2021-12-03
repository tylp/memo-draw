import { IAvatar } from 'server/interfaces/IAvatar';
import IProfile from '../interfaces/IProfile';

const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 16;

export default class ProfileValidatorService {
	public static validate(profile: IProfile): boolean {
		return this.validateUsername(profile?.username)
			&& this.validateAvatar(profile.avatar);
	}

	public static validateUsername(username: string): boolean {
		return username?.length >= MIN_USERNAME_LENGTH
			&& username?.length <= MAX_USERNAME_LENGTH;
	}

	public static validateAvatar(avatar: IAvatar): boolean {
		return !!(avatar && avatar.bodyColor && avatar.bodyType && avatar.faceType && avatar.rubberColor);
	}
}
