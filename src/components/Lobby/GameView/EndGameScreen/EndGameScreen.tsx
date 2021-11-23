import React from 'react';
import { Col, Row } from 'react-grid-system';
import { useTranslation } from 'react-i18next';
import { Lobby, Player } from '../../../../../server/classes';
import useLocalStorage from '../../../../hooks/useLocalStorage/useLocalStorage';
import { LocalStorageKey } from '../../../../hooks/useLocalStorage/useLocalStorage.types';
import { Layout } from '../../../Common';
import Box from '../../../Common/Box/Box';
import UserEtiquette from '../UserEtiquette/UserEtiquette';

interface EndGameScreenProps {
	lobby: Lobby;
}

export default function EndGameScreen(props: EndGameScreenProps): JSX.Element {
	const { t } = useTranslation();

	const [playerId] = useLocalStorage<string>(LocalStorageKey.PlayerId);

	const getPillTitleItsYou = (player: Player): undefined | string => {
		return (player.id === playerId) ? t('gameView.itsYouLabel') : undefined;
	}

	return (
		<Layout>
			<Row>
				<Col xs={12} lg={4}>
					{
						props.lobby.game?.players.map((player: Player, index: number) => (
							<Box mb={2} key={player.id}>
								<Row>
									<Col xs={8}>
										<UserEtiquette
											player={player}
											color='secondary'
											disabled={index > 0}
											rPillTitle={getPillTitleItsYou(player)} />
									</Col>
									<Col>
										<div className="flex h-full">
											<div className="m-auto">
												<NumberPill n={index + 1} />
											</div>
										</div>
									</Col>
								</Row>
							</Box>
						))
					}
				</Col>
				<Col>
					Liste des dessins
				</Col>
			</Row>
		</Layout>
	)
}

function NumberPill(props: { n: number }): JSX.Element {
	return (
		<div className="relative flex flex-row items-center w-full h-16 bg-blue-darker-blue text-yellow-light-yellow rounded-lg">
			<div className="flex-1 text-lg m-8 font-semibold text-white-white truncate">
				<div className="w-3 text-center">
					{props.n}
				</div>
			</div>
		</div>
	)
}