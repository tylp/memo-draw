import React from 'react'
import { useTranslation } from 'react-i18next';
import { Player } from '../../../../../server/classes';
import { Box, SectionTitle } from '../../../Common'
import UserEtiquette from '../../UserEtiquette/UserEtiquette';

interface PlayersAndSpectatorsProps {
	players: Player[];
	spectators: Player[];
	losers: Player[];
	currentPlayer: Player;
	playerId: Player['id'];
}

export default function PlayersAndSpectators(props: PlayersAndSpectatorsProps): JSX.Element {
	const { t } = useTranslation();

	const getPillTitleDrawing = (player: Player): undefined | string => {
		return (player.id === props.currentPlayer.id) ? t('gameView.currentlyDrawing') : undefined;
	}

	const getPillTitleItsYou = (player: Player): undefined | string => {
		return (player.id === props.playerId) ? t('gameView.itsYouLabel') : undefined;
	}

	const hasPlayerLost = (player: Player): boolean => {
		return props.losers.map(e => e.id).includes(player.id)
	}

	return (
		<div>
			<div className='h-16'>
				<SectionTitle hintColor="text-yellow-light-yellow">{t('gameView.playersTitle')}</SectionTitle>
			</div>
			<div>
				{
					props.players.map((player: Player) => (
						<Box mb={2} key={player.id} >
							<UserEtiquette player={player} color='secondary' disabled={hasPlayerLost(player)} rPillTitle={getPillTitleItsYou(player)} brPillTitle={getPillTitleDrawing(player)} />
						</Box>
					))
				}
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
			<div className='h-16'>
				<SectionTitle hintColor="text-yellow-light-yellow">{t('gameView.spectatorsTitle')}</SectionTitle>
			</div>
			<div>
				{
					props.spectators.map((player: Player) => (
						<Box mb={2} key={player.id} >
							<UserEtiquette player={player} color='light-secondary' rPillTitle={getPillTitleItsYou(player)} />
						</Box>
					))
				}
			</div>
		</>
	)
}