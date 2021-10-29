import ISession from '../../interfaces/ISession';
import Application from '../Application';
import Room from '../Room';
import Storage from './Storage';

export default class PlayerRoomStorage extends Storage<ISession['sessionId'], Room['id']> {
	public getRoomOf(sessionId: ISession['sessionId']): Room {
		return Application.getRoomStorage().get(this.get(sessionId));
	}
}
