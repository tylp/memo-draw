import React from 'react'
import { useTranslation } from 'react-i18next'
import type PlayerErrorVoteManager from 'server/classes/Lobby/PlayerErrorVoteManager/PlayerErrorVoteManager'
import { YesOrNo } from 'server/classes/Votes/YesNoVote'
import { Button } from 'src/components/Common'
import UserEtiquette from 'src/components/Lobby/UserEtiquette/UserEtiquette'

interface CurrentVoteProps {
	currentVoteManager: PlayerErrorVoteManager;
	currentVote: YesOrNo | undefined;
	vote: (vote: YesOrNo) => void;
}

export default function CurrentVote(props: CurrentVoteProps): JSX.Element {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col gap-2">
			<div className="flex-1">
				<UserEtiquette color="secondary" player={props.currentVoteManager.selectedPlayer} />
			</div>
			<div className="flex flex-row gap-2">
				<div className="flex-1">
					<Button
						size="small"
						selected={props.currentVote === 'yes'}
						color={props.currentVote !== 'no' ? 'primary' : 'light-secondary'}
						fullWidth
						onClick={() => props.vote('yes')}
					>{t('gameView.yes')}</Button>
				</div>
				<div className="flex-1">
					<Button
						size="small"
						selected={props.currentVote === 'no'}
						color={props.currentVote !== 'yes' ? 'primary' : 'light-secondary'}
						fullWidth
						onClick={() => props.vote('no')}
					>{t('gameView.no')}</Button>
				</div>
			</div>
		</div>
	)
}