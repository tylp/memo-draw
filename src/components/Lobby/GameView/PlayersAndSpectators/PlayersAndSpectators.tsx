import React from 'react'
import { useTranslation } from 'react-i18next';
import { Player } from '../../../../../server/classes';
import { Box, SectionTitle } from '../../../Common'
import UserEtiquette from '../../UserEtiquette/UserEtiquette';
import { faBomb } from '@fortawesome/free-solid-svg-icons';

interface PlayersAndSpectatorsProps {
	players: Player[];
	spectators: Player[];
	losers: Player[];
	currentPlayer: Player;
	playerId: Player['id'];
	startVote?: undefined | ((player: Player) => void);
}

export default function PlayersAndSpectators(props: PlayersAndSpectatorsProps): JSX.Element {
	const { t } = useTranslation();

	const getPillTitleDrawing = (player: Player): undefined | string => {
		return (player.id === props.currentPlayer?.id) ? t('gameView.currentlyDrawing') : undefined;
	}

	const getPillTitleItsYou = (player: Player): undefined | string => {
		return (player.id === props.playerId) ? t('gameView.itsYouLabel') : undefined;
	}

	const hasPlayerLost = (player: Player): boolean => {
		return props.losers.map(e => e.id).includes(player.id)
	}

	const canVoteAgainst = (player: Player): boolean => {
		return player.id !== props.playerId && !props.losers.map(e => e.id).includes(player.id)
	}

	return (
		<div>
			<Box mb={2}>
				<SectionTitle hintColor="text-yellow-light-yellow">
					{t('gameView.playersTitle')}
				</SectionTitle>
			</Box>
			<div>
				{props.players.map((player: Player) => (
					<Box mb={2} key={player.id} >
						<UserEtiquette
							player={player}
							color="secondary"
							disabled={hasPlayerLost(player)}
							rPillTitle={getPillTitleItsYou(player)}
							brPillTitle={getPillTitleDrawing(player)}
							leftPillIcon={faBomb}
							onLeftPillClick={canVoteAgainst(player) ? () => props.startVote?.(player) : undefined}
						/>
					</Box>
				))}
			</div>
			{
				props.spectators.length > 0 && <Spectators spectators={props.spectators} playerId={props.playerId} />
			}
		</div>
	)
}

interface SpectatorsProps {
	spectators: Player[];
	playerId: string;
}

function Spectators(props: SpectatorsProps): JSX.Element {
	const { t } = useTranslation();

	const getPillTitleItsYou = (player: Player): undefined | string => {
		return (player.id === props.playerId) ? t('gameView.itsYouLabel') : undefined;
	}

	return (
		<>
			<div className="mt-10 h-16">
				<SectionTitle hintColor="text-yellow-light-yellow">
					{t('gameView.spectatorsTitle')}
				</SectionTitle>
			</div>
			<div>
				{
					props.spectators.map((player: Player) => (
						<Box mb={2} key={player.id} >
							<UserEtiquette
								player={player}
								color="light-secondary"
								rPillTitle={getPillTitleItsYou(player)}
							/>
						</Box>
					))
				}
			</div>
		</>
	)
}