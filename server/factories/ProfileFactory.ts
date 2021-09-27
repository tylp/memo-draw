import IProfile from '../interfaces/IProfile';
import FakeNameGeneratorService from '../services/FakeNameGeneratorService';
import AvatarFactory from './AvatarFactory';

export default class ProfileFactory {
	static create(): IProfile {
		return {
			username: FakeNameGeneratorService.generate(),
			avatar: AvatarFactory.create()
		}
	}
}