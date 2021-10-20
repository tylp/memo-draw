import { faCrown, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Player from '../../../../server/classes/Player';
import { useSocketRoom } from '../../../hooks';
import Avatar from '../../Common/Avatar/Avatar';
import { UserCardSpec } from './UserCard.spec';

export default function UserCard(props: UserCardSpec): JSX.Element {
	const [isCreator] = useState(props.creatorId === props.currentPlayerId)
	const { t } = useTranslation();

	const socket = useSocketRoom();

	const kickPlayer = (player: Player) => {
		if (!isCreator) return;

		socket.emit('kick-player-from-room', player.id);
	}

	return (
		<div className="bg-blue-darker-blue h-40 w-32 rounded-md flex flex-col items-center m-2">
			<div className="w-full relative -top-3">
				<div className="flex flex-row">
					{props.player.id === props.currentPlayerId ?
						<div className="absolute -left-4 pl-1 pr-1 m-0 h-5 rounded-lg transform -rotate-12 bg-pink-dark-pink text-sm font-rubik-bold text-white-white">{t('userCard.badge')}</div>
						:
						''
					}
					{props.creatorId === props.player.id ?
						<div className="absolute left-1/2 transform -translate-x-1/2  left-px-20 top-3 rounded-full w-6 h-6 text-yellow-light-yellow text-center">
							<FontAwesomeIcon icon={faCrown} />
						</div>
						:
						''
					}
					{(isCreator && props.player.id !== props.creatorId) ?
						<div onClick={() => kickPlayer(props.player)} className="absolute cursor-pointer right-2 rounded-full w-6 h-6 bg-pink-dark-pink hover:bg-pink-light-pink font-bold text-white-white text-center">
							<FontAwesomeIcon icon={faTrash} />
						</div>
						:
						''
					}
				</div>
			</div>
			<div className="w-full pl-5 pr-5 pt-4 pb-1">
				<Avatar avatar={props.player.profile.avatar} />
			</div>
			<div className="text-center text-white-white font-bold text-sm text-start leading-4 pt-0 font-rubik-bold">{props.player.profile.username}</div>
		</div>
	)
}