import IProfile from '../interfaces/IProfile';

const MIN_LENGTH_USERNAME = 3;

export default class ProfileValidatorService {
	static isProfileValid(profile: IProfile): boolean {
		return profile.username.length >= MIN_LENGTH_USERNAME;
	} 
}
