import { TFunction } from 'i18next';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Lobby, Player } from '../../../../../../server/classes';

export function PlayerTurnCue(props: {lobby: Lobby, playerId: Player['id']}): JSX.Element {
	const { t } = useTranslation();
	const [cue, setCue] = useState({color: 'text-white-white', text: ''});

	useEffect(() => {
		setCue(CueFactory.create(props.lobby.game.currentPlayer.id === props.playerId, props.lobby.game.currentDrawingIndex === props.lobby.game.currentNumberOfDrawings, t))
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.lobby.game.currentPlayer.id,
		props.playerId,
		props.lobby.game.currentDrawingIndex,
		props.lobby.game.currentNumberOfDrawings]);

	return(
		<div className="bg-blue-darker-blue font-bold font-rubik h-full w-auto px-4 rounded-md flex items-center">
			<div className={cue.color}>{cue.text}</div>
		</div>
	)
}

class CueFactory {
	static create(isPlayerTurn: boolean, isLastDrawingIndex: boolean, t: TFunction): {color: string, text: string} {
		if(isPlayerTurn) {
			if(isLastDrawingIndex) {
				return {
					color: 'text-pink-light-pink',
					text: t('gameView.drawSomethingNew'),
				}
			} else {
				return {
					color: 'text-yellow-light-yellow',
					text: t('gameView.drawWhatYouRemember'),
				}
			}
		} else {
			return {
				color: 'text-white-white',
				text: t('gameView.memorizeEachDraw'),
			}
		}
	}
}