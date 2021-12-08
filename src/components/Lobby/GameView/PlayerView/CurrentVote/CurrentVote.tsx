import React from 'react'
import { Col, Row } from 'react-grid-system'
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
		<Row>
			<Col>
				<UserEtiquette color="secondary" player={props.currentVoteManager.selectedPlayer} />
			</Col>
			<Col>
				<Row>
					<Col sm={12} lg={6}>
						<Button
							size="small"
							selected={props.currentVote === 'yes'}
							color={props.currentVote !== 'no' ? 'primary' : 'light-secondary'}
							fullWidth
							onClick={() => props.vote('yes')}
						>{t('gameView.yes')}</Button>
					</Col>
					<Col sm={12} lg={6}>
						<Button
							size="small"
							selected={props.currentVote === 'no'}
							color={props.currentVote !== 'yes' ? 'primary' : 'light-secondary'}
							fullWidth
							onClick={() => props.vote('no')}
						>{t('gameView.no')}</Button>
					</Col>
				</Row>
			</Col>
		</Row>
	)
}