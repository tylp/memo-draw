import Vote, { Participant } from './Vote';

export type Yes = 'yes';
export type No = 'no';
export type YesOrNo = Yes | No;

export default class YesNoVote extends Vote {
	constructor(participants: Set<Participant>) {
		super(participants, new Set(['yes', 'no']));
	}
}