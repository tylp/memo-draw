import React from 'react';
import Player from '../../../../../server/classes/Player';
import { Avatar } from '../../../Common';
import { useTranslation } from 'react-i18next';

interface UserEtiquetteSpec {
	player: Player;
	creatorId: string;
	currentPlayer: Player;
}

export default function UserEtiquette(props: UserEtiquetteSpec): JSX.Element {
	const { t } = useTranslation();

	return (
		<div
			className="relative mb-2 flex flex-row items-center bg-blue-darker-blue w-full h-16 pl-2 text-white-white"
			style={{
				borderTopLeftRadius: '3em',
				borderBottomLeftRadius: '3em',
				borderTopRightRadius: '0.5em',
				borderBottomRightRadius: '0.5em',
			}}
		>
			<div className="flex-shrink-0 w-10 ml-1">
				<Avatar avatar={props.player.profile.avatar} />
			</div>
			<div className="flex-1 text-lg m-4 font-semibold text-white-white truncate">
				{props.player.profile.username}
			</div>
			{props.currentPlayer.id === props.player.id && (<div className="absolute -right-8 bottom-0 pl-1 pr-1 m-0 h-5 rounded-lg transform -rotate-12 bg-pink-dark-pink text-sm font-rubik-bold text-white-white">{t('gameView.currentlyDrawing')}</div>)}
		</div>
	)
}