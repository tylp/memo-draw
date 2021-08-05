import React, {useEffect, useState } from "react";
import { Title } from "../../Common";
import Button from "../../Common/Button/Button";
import SectionTitle from "../../Common/SectionTitle/SectionTitle";
import { SelectButtonSpec } from "./ProfileSelector.spec";

export function SelectButton(specs: SelectButtonSpec) : JSX.Element {
    return (
        <div className="flex flex-col items-center">
            <p className="text-md text-white-white">{specs.name}</p>
            <button 
                onClick={specs.onClick} 
                className="bg-blue-200 hover:bg-yellow-dark-yellow text-gray-800 font-bold py-1 px-1 rounded-full inline-flex items-center transition duration-300"
            >
                {
                    specs.direction === 'left' 
                    ? 
                        <svg viewBox="0 0 32 32" 
                            className="icon icon-arrow-left w-8 fill-current text-white-white" 
                            aria-hidden="true"
                        >
                            <path d="M26.025 14.496l-14.286-.001 6.366-6.366L15.979 6 5.975 16.003 15.971 26l2.129-2.129-6.367-6.366h14.29z"/>
                        </svg>
                    : 
                        <svg viewBox="0 0 32 32" 
                            className="transform rotate-180 icon icon-arrow-left w-8 fill-current text-white-white" 
                            aria-hidden="true"
                        >
                            <path d="M26.025 14.496l-14.286-.001 6.366-6.366L15.979 6 5.975 16.003 15.971 26l2.129-2.129-6.367-6.366h14.29z"/>
                        </svg>

                }
            </button>
        </div>
    );
}

export default function ProfileSelector(props): JSX.Element {

    const avatarUrls = [
        "https://media3.chapellerie-traclet.com/14578-thickbox_default/melon-hat.jpg",
        "https://www.hutstuebele.com/pic/Panama-hat-BORSALINO.10375a.jpg"
    ];

    const [currentUrlIndex, setCurrentUrlIndex] = useState<number>(0);
    const [isStartEnabled, setIsStartEnabled] = useState(true);

    useEffect(() => {
        setIsStartEnabled(props.username.length >= 3);
    }, [props.username]);

    const [userName, setUserName] = useState<string>("");

    function previousHat() {
        if (currentUrlIndex == 0)
            setCurrentUrlIndex(avatarUrls.length - 1);
        else
            setCurrentUrlIndex(currentUrlIndex - 1);
    }

    function previousBody() {
        if (currentUrlIndex == 0)
            setCurrentUrlIndex(avatarUrls.length - 1);
        else
            setCurrentUrlIndex(currentUrlIndex - 1);
    }

    function previousLead() {
        if (currentUrlIndex == 0)
            setCurrentUrlIndex(avatarUrls.length - 1);
        else
            setCurrentUrlIndex(currentUrlIndex - 1);
    }

    function nextHat() {
        if (currentUrlIndex == avatarUrls.length - 1)
            setCurrentUrlIndex(0);
        else
            setCurrentUrlIndex(currentUrlIndex + 1);
    }

    function nextBody() {
        if (currentUrlIndex == avatarUrls.length - 1)
            setCurrentUrlIndex(0);
        else
            setCurrentUrlIndex(currentUrlIndex + 1);
    }

    function nextLead() {
        if (currentUrlIndex == avatarUrls.length - 1)
            setCurrentUrlIndex(0);
        else
            setCurrentUrlIndex(currentUrlIndex + 1);
    }
    
    return (
		<div>
			<SectionTitle littleMessage="Hey there !" hintColor="text-yellow-light-yellow">WHO ARE YOU ?</SectionTitle>
			<div className="bg-blue-darker-blue rounded-md p-4 pt-2 md:max-w-xs">
				<Title>Avatar</Title>
				<div className="mt-4 grid grid-cols-3 grid-flow-col auto-cols-min">
					<div className="flex flex-col justify-between">
						<SelectButton direction="left" name="Hat" onClick={previousHat}/>
						<SelectButton direction="left" name="Body" onClick={previousBody}/>
						<SelectButton direction="left" name="Lead" onClick={previousLead}/>
					</div>

					<div className="flex items-center">
						<img className="rounded-full border-2 border-yellow-dark-yellow" src={avatarUrls[currentUrlIndex]}/>
					</div>

					<div className="flex flex-col justify-between">
						<SelectButton direction="right" name="Hat" onClick={nextHat}/>
						<SelectButton direction="right" name="Body" onClick={nextBody}/>
						<SelectButton direction="right" name="Lead" onClick={nextLead}/>
					</div>
				</div>

				<div className="mt-4">
					<Title>Pseudo</Title>
					<input className="bg-blue-200 w-full border-2 rounded border-yellow-light-yellow pl-2 text-white-white" type="text" onChange={(e) => props.handleUserName(e)} />
					<Button className="mt-2" disabled={!isStartEnabled} onClick={() => props.handleStart()}>Done !</Button>
				</div>
			</div>
		</div>
    )
}