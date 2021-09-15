import SocketIdentifierService from "../../services/SocketIdentifierService";
import Application from "../Application";
import Room from "../Room";
import Storage from "./Storage";

export default class PlayerRoomStorage extends Storage<string, string> {
	public getRoomOf(sessionId: string): Room {
		return Application.getRoomStorage().get(this.get(sessionId));
	}
}
