import Player from "./classes/Player";
import Room from "./classes/Room";

export default class RoomStorage {
	rooms: Map<string, Room>;
	constructor() {
		this.rooms = new Map<string, Room>();
	}

	find(id: string): Room {
		return this.rooms.get(id);
	}

	exists(id: string): boolean {
		return !!this.find(id);
	}

	isPlayerPresent(roomId: string, player: Player): boolean {
		const foundRoom: Room = this.find(roomId);

		if(foundRoom) {
			return foundRoom.isPlayerPresent(player);
		}

		return false;
	}

	save(room: Room): Room {
	    this.rooms.set(room.id, room);
		return room;
	}

    addPlayer(id: string, player: Player): Room{
		const room = this.find(id);
		if(!room.isPlayerPresent(player)) {
			room.addPlayer(player);
		}
		return room;
    }

    removePlayer(id: string, player: Player):void{
		this.find(id).removePlayer(player);
    }

	findAll(): Map<string, Room> {
		return this.rooms;
	}

    isEmpty(): boolean {
        return this.rooms.size === 0
    }
}