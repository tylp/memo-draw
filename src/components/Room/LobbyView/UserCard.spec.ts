import Player from '../../../../server/classes/Player';

export interface UserCardSpec {
	player: Player;
	creatorId?: string;
	currentPlayerId?: string | unknown;
	subtitle?: string;
}