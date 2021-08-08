import ISession from "../../interfaces/ISession";
import IdGeneratorService from "../../services/IdGeneratorService";
import Storage from "./Storage";

export default class RoomStorage extends Storage<string, ISession> {
	generate(): ISession {
		const sessionId = IdGeneratorService.generate();
		const playerId = IdGeneratorService.generate();
		return this.set(sessionId, {
			sessionId,
			playerId,
			// TODO: Find a better way to create a default profile, like a profile factory.
			profile: {
				rubberColor: 1,
				bodyColor: 1,
				faceType: 1,
				username: "Noname"
			}
		});
	}
	
	update(id: string, value: ISession): void {
		if(this.containsKey(id)) {
			this.set(id, {
				...this.get(id),
				...value
			})
		}
	}
}