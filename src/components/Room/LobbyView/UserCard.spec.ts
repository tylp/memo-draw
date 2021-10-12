import Player from '../../../../server/classes/Player';

export interface UserCardSpec {
	player: Player;
	creatorId?: string;
	currentPlayer?: Player;
	subtitle?: string;
	isCreator: boolean;
}