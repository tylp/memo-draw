import { Player } from '../..';
import YesNoVote from '../../Votes/YesNoVote';

export default class WrongDrawingVoteManager {
	currentVote?: YesNoVote | undefined;
	contestedDrawing?: number | undefined;

	public startVote(contestedDrawing: number, playersIds: Set<Player['id']>): void {
		if (this.canStartVote()) {
			this.currentVote = new YesNoVote(playersIds);
			this.contestedDrawing = contestedDrawing;
		}
	}

	public canStartVote(): boolean {
		return (!this.currentVote) || (this.currentVote.isClosed);
	}

	public endVote(): void {
		this.currentVote?.close();
		this.contestedDrawing = undefined;
	}
}