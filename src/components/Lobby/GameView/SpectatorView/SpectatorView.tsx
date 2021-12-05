import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import dayjs from 'dayjs'
import { Engine } from 'memo-draw-engine'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Lobby, Player } from '../../../../../server/classes'
import useLocalStorage from '../../../../hooks/useLocalStorage/useLocalStorage'
import { LocalStorageKey } from '../../../../hooks/useLocalStorage/useLocalStorage.types'
import { Button, Layout } from '../../../Common'
import Canvas from '../Canvas/Canvas'
import { EngineContextProvider } from '../Canvas/Toolbox/EngineContext'
import PlayersAndSpectators from '../PlayersAndSpectators/PlayersAndSpectators'
import Countdown from '../PlayerView/Countdown/Countdown'

import styles from '../../../../../styles/GameView.module.css';

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
		<Layout size="large">
			<EngineContextProvider engine={props.engine}>
				<div className={`mt-6 ${styles['grid-2']}`}>
					<div className={`${styles['col-gap']} ${styles['player-overflow']}`}>
						<PlayersAndSpectators
							players={props.lobby?.game?.players}
							spectators={props.spectators}
							losers={props.lobby.game.losers}
							playerId={playerId}
							currentPlayer={props.currentPlayer}
						/>
					</div>
					<div>
						<div className="relative">
							<div className="absolute top-0 md:-top-11">
								<Countdown limitDate={dayjs(props.lobby.game.limitDate)} />
							</div>
							<div style={{ right: '0' }} className="absolute top-0 md:-top-11">
								<div className="bg-pink-dark-pink rounded-md px-3 py-1 text-center">
									<span className="text-lg font-semibold text-white-white">
										{props.lobby.game.currentDrawingIndex}/{props.lobby.game.currentNumberOfDrawings}
									</span>
								</div>
							</div>
							<div className="h-12 absolute bottom-0 right-0">
								<Button
									color="primary"
									size="medium"
									fullHeight
									fullWidth
									icon={faArrowRight}
									onClick={props.leaveGame}>
									{t('lobbyView.leaveBtnLabel')}
								</Button>
							</div>
							<Canvas engine={props.engine} setEngine={props.setEngine} />
						</div>
					</div>
				</div>
			</EngineContextProvider >
		</Layout >
	)
}
