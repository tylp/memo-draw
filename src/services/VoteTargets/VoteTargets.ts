import { Lobby, Player } from '../../../server/classes';

export default class VoteTargets {
	protected losers: Player[];
	protected selfId: Player['id'];
	protected voteTargets: Player[];

	constructor(lobby: Lobby, selfId: Player['id']) {
		this.voteTargets = [...lobby?.game?.players];
		this.losers = lobby?.game?.losers;
		this.selfId = selfId;
		this.calculateVoteTargets();
	}

	public get(): Player[] {
		return this.voteTargets;
	}

	protected calculateVoteTargets(): void {
		if (this.selfId) {
			this.removeSelfFromTargets();
		}

		this.removeLosersFromTargets();
	}

	protected removeSelfFromTargets(): void {
		const indexOfSelf = this.getIndexOfSelf();
		this.voteTargets.splice(indexOfSelf, 1);
	}

	protected getIndexOfSelf(): number | undefined {
		return this.voteTargets.findIndex((p: Player) => p.id === this.selfId);
	}

	protected removeLosersFromTargets(): void {
		const idsOfLosers = this.getIdsOfLosers();
		this.voteTargets = this.voteTargets.filter((p: Player) => !idsOfLosers.includes(p.id));
	}

	protected getIdsOfLosers(): Player['id'][] {
		return this.losers.map(e => e.id);
	}
}