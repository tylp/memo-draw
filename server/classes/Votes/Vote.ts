export type Participant = string;
export type Option = string;

export default class Vote {
	protected participants: Set<Participant>;
	protected options: Set<Option>;
	public votes: Map<Participant, Option> = new Map<Participant, Option>();
	public isClosed = false;
	protected results: Map<Option, number>;
	protected winners: Set<Option>;

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

	public getResults(): Map<Option, number> {
		if (!this.isClosed) return;

		if (this.results) {
			return this.results;
		}

		const results = new Map<Option, number>();

		this.options.forEach((option: Option) => results.set(option, 0));

		this.votes.forEach((o: Option) => {
			const currentNumber = results.get(o);
			results.set(o, currentNumber + 1);
		})

		this.results = results;

		return results;
	}

	public getWinners(): Set<Option> {
		if (!this.isClosed) return;

		if (this.winners) {
			return this.winners;
		}

		const winners = new Set<Option>();

		const maxVotes = Math.max(...this.getResults().values());

		this.getResults().forEach((v: number, o: Option) => {
			if (v === maxVotes) {
				winners.add(o);
			}
		});

		this.winners = winners;

		return winners;
	}
}