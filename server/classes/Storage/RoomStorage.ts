import Player from "../Player";
import Room from "../Room";
import Storage from "./Storage";

export default class RoomStorage extends Storage<string, Room> {
	isPlayerPresent(roomId: string, player: Player): boolean {
		const foundRoom: Room = this.get(roomId);
		
		if(foundRoom) {
			return foundRoom.isPlayerPresent(player);
		}
		
		return false;
	}
	
	addPlayer(id: string, player: Player): Room{
		const room = this.get(id);
		
		if(!room.isPlayerPresent(player)) {
			room.addPlayer(player);
		}
		
		return room;
	}
	
	removePlayer(id: string, player: Player): void{
		this.get(id).removePlayer(player);
	}
}