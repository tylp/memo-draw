import React from 'react'
import { Col, Row } from 'react-grid-system'
import type PlayerErrorVoteManager from 'server/classes/Lobby/PlayerErrorVoteManager/PlayerErrorVoteManager'
import { YesOrNo } from 'server/classes/Votes/YesNoVote'
import { Button } from 'src/components/Common'
import UserEtiquette from 'src/components/Lobby/UserEtiquette/UserEtiquette'

interface CurrentVoteProps {
	currentVote: PlayerErrorVoteManager;
	vote: (vote: YesOrNo) => void;
}

export default function CurrentVote(props: CurrentVoteProps): JSX.Element {
	return (
		<Row>
			<Col>
				<UserEtiquette color="secondary" player={props.currentVote.selectedPlayer} />
			</Col>
			<Col>
				<Row>
					<Col>
						<Button size={'small'} color={'primary'} fullWidth>Yes</Button>
					</Col>
					<Col>
						<Button size={'small'} color={'primary'} fullWidth>No</Button>
					</Col>
				</Row>
			</Col>
		</Row>
	)
}