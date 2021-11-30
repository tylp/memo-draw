import React, { Dispatch, SetStateAction } from 'react';
import { Button, Title } from '../../../Common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '../../../Common/Box/Box';
import { Col, Row } from 'react-grid-system';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface GameSettingSpec {
	title: string,
	description: string,
	icon: IconProp,
	setCurrentValue: Dispatch<SetStateAction<string | number>>,
	currentValue: string | number
	value: string | number
}

export function GameSetting(props: GameSettingSpec): JSX.Element {
	return (
		<Row>
			<Col>
				<div className="p-5 w-full bg-blue-darker-blue rounded-md">
					<Row>
						<Col>
							<div className="flex flex-row justify-between">
								<Title>{props.title}</Title>
								<FontAwesomeIcon className="text-yellow-light-yellow text-2xl" icon={props.icon} />
							</div>
						</Col>
					</Row>
					<Row style={{ marginBottom: '10px' }}>
						<Col>
							<p className="leading-tight text-white-white">{props.description}</p>
						</Col>
					</Row>
					<Row>
						<Col>
							<Box mt={2}>
								<Button
									size="large"
									color="light-secondary"
									fullWidth
									selected={props.currentValue === props.value}
									onClick={() => props.setCurrentValue(props.value)}
								>
									{props.title}
								</Button>
							</Box>
						</Col>
					</Row>
				</div>
			</Col>
		</Row>
	);
}