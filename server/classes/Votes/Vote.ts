export type Participant = string;
export type Option = string;

export default class Vote {
	protected participants: Set<Participant>;
	protected options: Set<Option>;
	public votes: Map<Participant, Option> = new Map<Participant, Option>();
	public isClosed = false;

	constructor(participants: Set<Participant>, options: Set<Option>) {
		this.participants = participants;
		this.options = options;
	}

	public vote(participant: Participant, option: Option): void {
		if (!this.isClosed && this.optionExists(option) && this.participantExists(participant)) {
			this.votes.set(participant, option);
		}
	}

	public getVoteOf(participant: Participant): Option {
		return this.votes.get(participant);
	}

	private optionExists(option: Option): boolean {
		return this.options.has(option);
	}

	private participantExists(participant: Participant): boolean {
		return this.participants.has(participant);
	}

	public close(): void {
		this.isClosed = true;
	}
}