import Player from '../classes/Player';
import ISession from '../interfaces/ISession';

export default class PlayerFactory {
	public static create(session: ISession): Player {
		return new Player(session);
	}
}