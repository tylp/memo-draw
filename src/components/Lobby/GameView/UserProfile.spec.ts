import Player from '../../../../server/classes/Player';

export interface UserProfileSpec {
	player: Player;
	creatorId: string;
	currentPlayer: Player;
}