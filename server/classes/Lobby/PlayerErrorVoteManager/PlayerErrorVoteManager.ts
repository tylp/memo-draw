import { WinType } from './../../Votes/YesNoVote';
import { Player } from '../..';
import YesNoVote from '../../Votes/YesNoVote';

export default class PlayerErrorVoteManager {
	currentVote?: YesNoVote | undefined;
	selectedPlayer?: Player | undefined;

	public startVote(selectedPlayer: Player, playersIds: Set<Player['id']>): void {
		if (this.canStartVote()) {
			this.currentVote = new YesNoVote(playersIds, WinType.NoWinsOnDraw);
			this.selectedPlayer = selectedPlayer;
		}
	}

	public canStartVote(): boolean {
		return (!this.currentVote) || (this.currentVote.isClosed);
	}

	public endVote(): void {
		this.currentVote?.close();
	}
}