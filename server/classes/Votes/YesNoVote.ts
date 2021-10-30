import Vote, { Participant } from './Vote';

export default class YesNoVote extends Vote {
	constructor(participants: Set<Participant>) {
		super(participants, new Set(['yes', 'no']));
	}
}