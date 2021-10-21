import React from 'react';
import { Button, RadioList, Title } from '../../../Common';
import { faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface GameSettingSpec<T> {
	name: string,
	list: T[],
}

export function GameSetting<T>(props: GameSettingSpec<T>): JSX.Element {
	const speedPropertiesValues = Object.values(props.list)

	return (
		<div className="pt-3 pb-3 pl-3 pr-3 mr-4 h-auto w-96 bg-blue-darker-blue rounded-md flex flex-col">
			<div className="flex flex-row justify-between">
				<Title>{props.name}</Title>
				<FontAwesomeIcon className="text-yellow-light-yellow" icon={faStopwatch} />
			</div>

			<p className="leading-tight text-white-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam </p>

			<div className="flex flex-row justify-between">
				<RadioList name={props.name} list={speedPropertiesValues} color='light-secondary' size='big' />
			</div>
		</div>
	);
}