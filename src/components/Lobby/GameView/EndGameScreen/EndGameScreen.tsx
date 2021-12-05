import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-grid-system';
import { useTranslation } from 'react-i18next';
import { Socket } from 'socket.io-client';
import { Lobby, Player } from '../../../../../server/classes';
import useLocalStorage from '../../../../hooks/useLocalStorage/useLocalStorage';
import { LocalStorageKey } from '../../../../hooks/useLocalStorage/useLocalStorage.types';
import SocketEventEmitter from '../../../../services/SocketEventEmitter';
import { Button, Layout } from '../../../Common';
import Box from '../../../Common/Box/Box';
import UserEtiquette from '../../UserEtiquette/UserEtiquette';

interface EndGameScreenProps {
	lobby: Lobby;
	socket: Socket;
	leaveGame: () => void;
}

export default function EndGameScreen(props: EndGameScreenProps): JSX.Element {
	const { t } = useTranslation();

	const [playerId] = useLocalStorage<string>(LocalStorageKey.PlayerId);

	const playAgain = () => {
		if (props.lobby?.game?.hasEnded) {
			SocketEventEmitter.playAgain(props.socket);
		}
	}

	return (
		<Layout>
			<Row gutterWidth={8}>
				<Col xs={12} md={6} lg={4}>
					<Row gutterWidth={8}>
						<Col xs={12}>
							<Box mb={2}>
								{
									props.lobby?.hostPlayerId === playerId ? (
										<Button onClick={playAgain} size="medium" fullWidth color="primary">{t('gameView.playAgain')}</Button>
									) : (
										<Button onClick={props.leaveGame} size="medium" fullWidth color="primary">{t('lobbyView.leaveBtnLabel')}</Button>
									)
								}
							</Box>
						</Col>
					</Row>
					<Row gutterWidth={8}>
						<Col>
							<Players players={props?.lobby?.game?.losers} winner={props?.lobby?.game?.winner} />
						</Col>
					</Row>
				</Col>
				<Col>
					<Row gutterWidth={8}>
						{
							[1, 2, 3, 4, 5].map(e => (
								<Col xs={12} lg={6} key={e}>
									<Box mb={2}>
										<div className="w-full h-48	rounded-lg bg-blue-darker-blue">
											<span className="inline-block text-center w-full h-full py-20 text-white-white">
												Drawing here
											</span>
										</div>
									</Box>
								</Col>
							))
						}
					</Row>
				</Col>
			</Row>
		</Layout>
	)
}

function Players(props: { players: Player[], winner: Player }): JSX.Element {
	const { t } = useTranslation();

	const [playerId] = useLocalStorage<string>(LocalStorageKey.PlayerId);

	const [playersList, setPlayersList] = useState<Player[]>([]);

	const getPillTitleItsYou = (player: Player): undefined | string => {
		return (player.id === playerId) ? t('gameView.itsYouLabel') : undefined;
	}

	useEffect(() => {
		setPlayersList([props.winner, ...props.players]);
	}, [props.players, props.winner])

	return (
		<>
			{
				playersList.map((player: Player, index: number) => (
					<Box mb={2} key={player.id}>
						<div className="flex">
							<div className="flex-1 pr-2">
								<UserEtiquette
									player={player}
									color="secondary"
									disabled={index > 0}
									rPillTitle={getPillTitleItsYou(player)} />
							</div>
							<div className="flex h-full">
								<div className="m-auto">
									<NumberPill n={index + 1} />
								</div>
							</div>
						</div>
					</Box>
				))
			}
		</>
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