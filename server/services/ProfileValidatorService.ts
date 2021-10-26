import IProfile from '../interfaces/IProfile';

const MIN_USERNAME_LENGTH = 3;

export default class ProfileValidatorService {
	static validate(profile: IProfile): boolean {
		return profile.username.length >= MIN_USERNAME_LENGTH;
	} 
}
