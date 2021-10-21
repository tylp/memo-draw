import React from "react";
import { Button, Radio, Title } from "../../../Common";
import { faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function GameSetting(): JSX.Element {
    return (
        <div className="pt-2 pb-2 pl-2 pr-2 h-auto w-96 bg-blue-darker-blue rounded-md flex flex-col">
            <div className="flex flex-row justify-between">
                <Title>Speed</Title>
                <FontAwesomeIcon className="text-yellow-light-yellow" icon={faStopwatch} />
            </div>
            <p className="text-white-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam </p>
            <div className="flex flex-row justify-around">
                <Radio color='light-secondary' size='big'/>
            </div>
            <div className="flex flex-row justify-around">
                <Button size="big" color="light-secondary">Slow</Button>
                <Button size="big" color="light-secondary">Normal</Button>
                <Button size="big" color="light-secondary">Fast</Button>
            </div>
        </div>
    );
}