import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import dayjs from 'dayjs'
import { Engine } from 'memo-draw-engine'
import React from 'react'
import { Col, Row } from 'react-grid-system'
import { useTranslation } from 'react-i18next'
import { Lobby, Player } from '../../../../../server/classes'
import useLocalStorage from '../../../../hooks/useLocalStorage/useLocalStorage'
import { LocalStorageKey } from '../../../../hooks/useLocalStorage/useLocalStorage.types'
import { Button, Layout } from '../../../Common'
import Canvas from '../Canvas/Canvas'
import { EngineContextProvider } from '../Canvas/Toolbox/EngineContext'
import PlayersAndSpectators from '../PlayersAndSpectators/PlayersAndSpectators'
import Countdown from '../PlayerView/Countdown/Countdown'

interface SpectatorViewProps {
	lobby: Lobby;
	spectators: Player[];
	currentPlayer: Player;
	leaveGame: () => void;
	engine: Engine;
	setEngine: React.Dispatch<React.SetStateAction<Engine>>;
}

export default function SpectatorView(props: SpectatorViewProps): JSX.Element {
	const { t } = useTranslation();

	const [playerId] = useLocalStorage<Player['id']>(LocalStorageKey.PlayerId);

	return (
		<Layout>
			<Row>
				<Col>
					<EngineContextProvider engine={props.engine}>
						<div className='flex flex-row justify-center'>
							<div className='flex flex-col flex-1 w-52'>
								<PlayersAndSpectators
									players={props.lobby?.game?.players}
									spectators={props.spectators}
									losers={props.lobby.game.losers}
									playerId={playerId}
									currentPlayer={props.currentPlayer}
								/>
							</div>
							<div className='flex flex-col flex-shrink-0 ml-8 mr-8'>
								<div className='flex flex-row justify-between'>
									<div className='h-16'>
										<Countdown limitDate={dayjs(props.lobby.game.limitDate)} />
									</div>
									<div className="bg-pink-dark-pink rounded-md p-3 h-12 w-24 text-center">
										<span className="text-lg font-semibold text-white-white">{props.lobby.game.currentDrawingIndex}/{props.lobby.game.currentNumberOfDrawings}</span>
									</div>
								</div>
								<div>
									<Canvas engine={props.engine} setEngine={props.setEngine} />
								</div>
							</div>
							<div className='flex flex-col justify-between flex-1 w-52'>
								<div className='h-12'>
									<Button
										color='primary'
										size='medium'
										fullHeight
										fullWidth
										icon={faArrowRight}
										onClick={props.leaveGame}>
										{t('lobbyView.leaveBtnLabel')}
									</Button>
								</div>
							</div>
						</div>
					</EngineContextProvider>
				</Col>
			</Row>
		</Layout >
	)
}
