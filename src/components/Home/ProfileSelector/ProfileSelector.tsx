import React, {useEffect, useState } from "react";
import { Title } from "../../Common";
import Button from "../../Common/Button/Button";
import SectionTitle from "../../Common/SectionTitle/SectionTitle";
import { IProfileSelector, SelectButtonSpec } from "./ProfileSelector.spec";
import Avatar from "../../Common/Avatar/Avatar";

import { RubberColor, BodyType, BodyColor, FaceType } from "../../../../server/interfaces/IProfile";

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

export default function ProfileSelector(props: IProfileSelector): JSX.Element {

    const bodyColors = Object.values(BodyColor);
    const rubberColors = Object.values(RubberColor);

    const [isStartEnabled, setIsStartEnabled] = useState(true);

    const [rubberColor, setRubberColor] = useState<RubberColor>(RubberColor.Pink);
    const [bodyColor, setBodyColor] = useState<BodyColor>(BodyColor.Yellow);
    const [bodyType, setBodyType] = useState<BodyType>(BodyType.Pencil);
    const [faceType, setFaceType] = useState<FaceType>(FaceType.Happy);

    useEffect(() => {
        setIsStartEnabled(props.username.length >= 3);
    }, [props.username]);

    useEffect(() => {
        const avatarElement : any = document.getElementById('avatarBody');
        if(typeof document !== 'undefined' && avatarElement && avatarElement.contentDocument) {
            const avatarBodyPaintElement = avatarElement.contentDocument.getElementById('avatar-body-paint');
            if(avatarBodyPaintElement)
                avatarBodyPaintElement.style.fill = bodyColor;
        }
    }, [bodyColor]);

    useEffect(() => {
        const avatarElement : any = document.getElementById('avatarBody');
        if(typeof document !== 'undefined' && avatarElement && avatarElement.contentDocument) {
            const eraserBodyPaintElement = avatarElement.contentDocument.getElementById('eraser-paint');
            if(eraserBodyPaintElement)
            eraserBodyPaintElement.style.fill = rubberColor;
        }
    }, [rubberColor]);

    function previousRubberColor() {
        if(rubberColor === rubberColors[0]) {
            setRubberColor(rubberColors[rubberColors.length - 1]);
        }
        else {
            const indexOfCurrentColor = rubberColors.findIndex(e => e == rubberColor);
            setRubberColor(rubberColors[indexOfCurrentColor - 1]);
        }
    }

    function nextRubberColor() {
        if(rubberColor === rubberColors[rubberColors.length - 1]) {
            setRubberColor(rubberColors[0]);
        }
        else {
            const indexOfCurrentColor = rubberColors.findIndex(e => e == rubberColor);
            setRubberColor(rubberColors[indexOfCurrentColor + 1]);
        }
    }

    function previousBodyColor() {
        if(bodyColor === bodyColors[0]) {
            setBodyColor(bodyColors[bodyColors.length - 1]);
        }
        else {
            const indexOfCurrentColor = bodyColors.findIndex(e => e == bodyColor);
            setBodyColor(bodyColors[indexOfCurrentColor - 1]);
        }
    }

    function nextBodyColor() {
        if(bodyColor === bodyColors[bodyColors.length - 1]) {
            setBodyColor(bodyColors[0]);
        }
        else {
            const indexOfCurrentColor = bodyColors.findIndex(e => e == bodyColor);
            setBodyColor(bodyColors[indexOfCurrentColor + 1]);
        }
    }

    function previousFaceType() {
        if (faceType == 0)
            setFaceType(Object.keys(FaceType).length / 2 - 1);
        else
            setFaceType(faceType - 1);
    }

    function nextFaceType() {
        if (faceType == Object.keys(FaceType).length / 2  - 1)
            setFaceType(0);
        else
            setFaceType(faceType + 1);
    }

    return (
		<div>
			<SectionTitle subtitle="Hey there !" hintColor="text-yellow-light-yellow">WHO ARE YOU ?</SectionTitle>
			<div className="bg-blue-darker-blue rounded-md p-4 pt-2 md:max-w-xs">
				<Title>Avatar</Title>
				<div className="mt-4 grid grid-cols-3 grid-flow-col auto-cols-min">
					<div className="flex flex-col justify-between">
						<SelectButton direction="left" name="Rubber" onClick={previousRubberColor}/>
						<SelectButton direction="left" name="Body" onClick={previousBodyColor}/>
						<SelectButton direction="left" name="Face" onClick={previousFaceType}/>
					</div>

					<div className="flex items-center">
                        <Avatar rubberColor={rubberColor} bodyType={bodyType} bodyColor={bodyColor} faceType={faceType}/>
                    </div>

					<div className="flex flex-col justify-between">
						<SelectButton direction="right" name="Rubber" onClick={nextRubberColor}/>
						<SelectButton direction="right" name="Body" onClick={nextBodyColor}/>
						<SelectButton direction="right" name="Face" onClick={nextFaceType}/>
					</div>
				</div>

				<div className="mt-4">
					<Title>Pseudo</Title>
					<form onSubmit={(e) => {
                            e.preventDefault();
                            props.handleStart();
                        }}>
                        <input className="bg-blue-200 w-full border-2 rounded border-yellow-light-yellow pl-2 text-white-white" type="text" onChange={(e) => props.handleUserName(e)} />
                        <Button className="mt-2" disabled={!isStartEnabled} type="submit">Done !</Button>
                    </form>
				</div>
			</div>
		</div>
    )
    
}
