import React from 'react';
import Player from '../../../../../server/classes/Player';
import { Avatar } from '../../../Common';

interface UserEtiquetteSpec {
	player: Player;
	creatorId: string;
	currentPlayer: Player;
}

export default function UserProfile(props: UserEtiquetteSpec): JSX.Element {
	return (
		<p className="bg-blue-200 w-full border-2 rounded border-yellow-light-yellow pl-2 text-white-white">
			<Avatar avatar={props.player.profile.avatar} />
			{props.player.profile.username} {props.currentPlayer.id === props.player.id ? 'Current' : ''}
		</p>
	)
}