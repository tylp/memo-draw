import React, { Dispatch, SetStateAction } from 'react';
import { Button, Title } from '../../../Common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '../../../Common/Box/Box';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface GameSettingSpec {
	title: string,
	description: string,
	icon: IconProp,
	setCurrentValue: Dispatch<SetStateAction<string | number>>,
	currentValue: string | number
	value: string | number
	disabled?: boolean
}

export function GameSetting(props: GameSettingSpec): JSX.Element {
	return (
		<div className="p-5 mb-4 w-full bg-blue-darker-blue rounded-md">
			<div className="flex flex-row justify-between">
				<Title>{props.title}</Title>
				<FontAwesomeIcon className="text-yellow-light-yellow text-2xl" icon={props.icon} />
			</div>
			<p className="leading-tight text-white-white mb-5">{props.description}</p>
			<Box mt={2}>
				<Button
					size="large"
					color="light-secondary"
					fullWidth
					disabled={props.disabled}
					selected={props.currentValue === props.value}
					onClick={() => props.setCurrentValue(props.value)}
				>
					{props.title}
				</Button>
			</Box>
		</div>
	);
}