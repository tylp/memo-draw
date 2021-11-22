import Vote, { Participant } from './Vote';

export type Yes = 'yes';
export type No = 'no';
export type YesOrNo = Yes | No;

export enum WinType {
	YesWinsOnDraw,
	NoWinsOnDraw,
}

export default class YesNoVote extends Vote {
	type: WinType;

	constructor(participants: Set<Participant>, type: WinType = WinType.YesWinsOnDraw) {
		super(participants, new Set(['yes', 'no']));
		this.type = type;
	}

	public getBooleanWinner(): boolean {
		const winners = this.getWinners();

		if (winners.size === 1) {
			return winners.has('yes') ? true : false;
		}

		return this.type === WinType.YesWinsOnDraw ? true : false;
	}
}