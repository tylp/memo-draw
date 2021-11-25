import { WinType } from './../../Votes/YesNoVote';
import { Player } from '../..';
import YesNoVote from '../../Votes/YesNoVote';
import dayjs, { Dayjs } from 'dayjs';

export default class PlayerErrorVoteManager {
	currentVote?: YesNoVote | undefined;
	selectedPlayer?: Player | undefined;
	voteEndDate?: Dayjs | undefined;

	static timerInSeconds = 10;

	public startVote(selectedPlayer: Player, playersIds: Set<Player['id']>): void {
		if (this.canStartVote()) {
			this.currentVote = new YesNoVote(playersIds, WinType.NoWinsOnDraw);
			this.selectedPlayer = selectedPlayer;
			this.voteEndDate = dayjs().add(PlayerErrorVoteManager.timerInSeconds, 'seconds');
		}
	}

	public canStartVote(): boolean {
		return (!this.currentVote) || (this.currentVote.isClosed);
	}

	public endVote(): void {
		this.currentVote?.close();
	}

	public getVoteEndDate(): Dayjs | undefined {
		return this.voteEndDate;
	}
}