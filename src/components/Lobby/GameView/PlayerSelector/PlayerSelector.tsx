import React from 'react';
import { Col, Row } from 'react-grid-system';
import { Player } from '../../../../../server/classes';
import Box from '../../../Common/Box/Box';
import UserEtiquette from '../UserEtiquette/UserEtiquette';

interface PlayerSelectorProps {
	list: Array<Player>;
	selected: Player | undefined;
	setSelected: React.Dispatch<React.SetStateAction<Player>>;
}

export default function PlayerSelector(props: PlayerSelectorProps): JSX.Element {
	return (
		<Row>
			<Col xs={12}>
				{
					props.list.map(
						(player: Player) => (
							<Box mb={2} key={player.id} onClick={() => props.setSelected(player)}>
								<UserEtiquette color={props.selected === player ? 'light-secondary' : 'secondary'} player={player} />
							</Box>
						),
					)
				}
			</Col>
		</Row >
	)
}
