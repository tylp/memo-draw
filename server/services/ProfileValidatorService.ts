import IProfile from '../interfaces/IProfile';

export default class ProfileValidatorService {
	static isProfileValid(profile: IProfile): boolean {
		return profile.username.length >= 3;
	} 
}
