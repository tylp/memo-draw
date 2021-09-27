import ProfileFactory from '../../factories/ProfileFactory';
import ISession from '../../interfaces/ISession';
import IdGeneratorService from '../../services/IdGeneratorService';
import Storage from './Storage';

export default class RoomStorage extends Storage<string, ISession> {
	generate(): ISession {
		const sessionId = IdGeneratorService.generate();
		const playerId = IdGeneratorService.generate();
		return this.set(sessionId, {
			sessionId,
			playerId,
			profile: ProfileFactory.create()
		});
	}
	
	update(id: string, value: ISession): ISession | undefined {
		if(this.containsKey(id)) {
			const newSession = {
				...this.get(id),
				...value
			}
			this.set(id, newSession)
			return newSession;
		}
	}
}
