import ISession from '../../interfaces/ISession';
import Application from '../Application';
import { Lobby } from '..';
import Storage from './Storage';

export default class PlayerLobbyStorage extends Storage<ISession['sessionId'], Lobby['id']> {
	public getLobbyOf(sessionId: ISession['sessionId']): Lobby {
		return Application.getLobbyStorage().get(this.get(sessionId));
	}
}
