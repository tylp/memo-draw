import Player from "./Player";
import Room from "./Room";
import { shuffle } from "lodash";

export class Game {
    id: string;
    creatorPlayerId: string;
    players: Array<Player>;
    currentDrawingIndex: number;
    currentNumberOfDrawings: number;
    currentPlayerIndex: number;

    constructor(room: Room) {
        this.id = room.id;
        this.creatorPlayerId = room.creatorPlayerId;
        this.players = shuffle(room.players);
        this.currentDrawingIndex = 0;
        this.currentNumberOfDrawings = 0;
        this.currentPlayerIndex = 0;
    }

    isTurnOf(player: Player): boolean {
        return this.players[this.currentPlayerIndex].id === player.id;
    }

    nextDrawing(): void {
        if(this.currentDrawingIndex === this.currentNumberOfDrawings) {
            this.currentNumberOfDrawings++;
            this.nextPlayer();
        } else {
            this.currentDrawingIndex++;
        }
    }

    nextPlayer(): void {
        this.currentDrawingIndex = 0;
        if(this.currentPlayerIndex === this.players.length - 1) {
            this.currentPlayerIndex = 0;
        } else {
            this.currentPlayerIndex++;
        }
    }
}