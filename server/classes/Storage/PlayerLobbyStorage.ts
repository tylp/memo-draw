import ISession from '../../interfaces/ISession';
import Application from '../Application';
import Room from '../Room';
import Storage from './Storage';

export default class PlayerLobbyStorage extends Storage<ISession['sessionId'], Room['id']> {
	public getRoomOf(sessionId: ISession['sessionId']): Room {
		return Application.getLobbyStorage().get(this.get(sessionId));
	}
}
