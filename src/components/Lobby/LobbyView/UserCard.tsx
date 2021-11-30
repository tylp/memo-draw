import { faCrown, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Player from '../../../../server/classes/Player';
import { Avatar } from '../../../components/Common';
import { useSocketLobby } from '../../../hooks';
import SocketEventEmitter from '../../../services/SocketEventEmitter';

interface UserCardSpec {
	player: Player;
	creatorId?: string;
	currentPlayerId?: string | unknown;
	subtitle?: string;
}

export default function UserCard(props: UserCardSpec): JSX.Element {
	const [isCreator] = useState(props.creatorId === props.currentPlayerId)
	const { t } = useTranslation();

	const socket = useSocketLobby();

	const kickPlayer = (player: Player) => {
		if (!isCreator || !socket) return;

		SocketEventEmitter.kickPlayerFromLobby(socket, player.id);
	}

	return (
		<div className="bg-blue-darker-blue h-40 w-40 rounded-md m-2">
			<div className="relative">
				{props.player.id === props.currentPlayerId &&
					<div style={{ top: '-10px', left: -15 }} className="absolute px-2 rounded-lg transform -rotate-12 bg-pink-dark-pink text-sm font-rubik-bold text-white-white">
						{t('userCard.badge')}
					</div>
				}
				{(isCreator && props.player.id !== props.creatorId) &&
					<div
						style={{ top: '-10px', right: 10 }}
						onClick={() => kickPlayer(props.player)}
						className="absolute cursor-pointer rounded-full w-6 h-6 bg-pink-dark-pink hover:bg-pink-light-pink font-bold text-white-white text-center"
					>
						<FontAwesomeIcon icon={faTrash} />
					</div>
				}
			</div>
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
				<div style={{ position: 'relative' }}>
					{props.creatorId === props.player.id &&
						<div style={{ left: 0, right: 0, textAlign: 'center', top: '-20px' }} className="absolute text-yellow-light-yellow">
							<FontAwesomeIcon icon={faCrown} />
						</div>
					}
					<div className="w-20 mx-auto mb-4">
						<Avatar avatar={props.player.profile.avatar} />
					</div>
					<div className="text-center text-white-white font-bold text-sm text-start leading-4 pt-0 font-rubik-bold">
						{props.player.profile.username}
					</div>
				</div>
			</div>
		</div>
	)
}