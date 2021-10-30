export type Participant = string;
export type Option = string;

export default class Vote {
	protected participants: Set<Participant>;
	protected options: Set<Option>;
	protected votes: Map<Participant, Option>;

	constructor(participants: Set<Participant>, options: Set<Option>) {
		this.participants = participants;
		this.options = options;
	}

	public vote(participant: Participant, option: Option): void {
		if (this.optionExists(option) && this.participantExists(participant)) {
			this.votes.set(participant, option);
		}
	}

	private optionExists(option: Option): boolean {
		return this.options.has(option);
	}

	private participantExists(participant: Participant): boolean {
		return this.options.has(participant);
	}

	get results(): Map<Participant, Option> {
		return this.votes;
	}
}