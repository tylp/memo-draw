import { AlphaColor, Color, ShapeType } from 'memo-draw-engine';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';

import { faPen, faFill, faSquare as faSquareFill, faCircle as faCircleFill, faEraser } from '@fortawesome/free-solid-svg-icons';
import { faSquare as faSquare, faCircle, faWindowMinimize } from '@fortawesome/free-regular-svg-icons';

import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { CustomShapeType, EngineContext } from './EngineContext';

export const colors: Array<Color> = [
	// black
	new Color(0, 0, 0),
	new Color(125, 125, 125),
	new Color(255, 255, 255),

	// red
	new Color(97, 0, 0),
	new Color(255, 0, 0),
	new Color(255, 143, 143),
	
	// yellow
	new Color(252, 168, 0),
	new Color(255, 255, 0),
	new Color(255, 251, 145),
	
	// green
	new Color(24, 112, 0),
	new Color(0, 255, 0),
	new Color(120, 255, 84),
	
	// blue
	new Color(0, 0, 145),
	new Color(0, 0, 255),
	new Color(0, 255, 255),
	
	// pink
	new Color(92, 0, 153),
	new Color(255, 0, 255),
	new Color(251, 148, 255),
];

function SelectionSummary(): JSX.Element {
	const { customDrawState } = useContext(EngineContext);

	const alphaColor = new AlphaColor(
		customDrawState.color.red,
		customDrawState.color.green,
		customDrawState.color.blue,
		customDrawState.opacity * 255,
	);

	return (
		<div className='border-2 border-opacity-50 border-black-black' style={{
			position: 'relative',
			background: alphaColor.toRgba(),
			width: '6rem',
			height: '6rem',
			borderRadius: '6rem',
			marginBottom: '45px',
		}}>
			<ToolSelectionSummary/>
		</div>
	)
}

interface ShapeInfo {
	name: string,
	icon: IconProp,
	type: CustomShapeType,
}

function ToolSelectionSummary(): JSX.Element {

	const { customDrawState } = useContext(EngineContext);

	const shapes: Array<ShapeInfo> = [
		{ name: 'Pencil', icon: faPen, type: ShapeType.Pencil },
		{ name: 'Fill', icon: faFill, type: ShapeType.Fill },
		{ name: 'Rectangle S', icon: faSquare, type: ShapeType.RectangleStroke },
		{ name: 'Rectangle F', icon: faSquareFill, type: ShapeType.RectangleFull },
		{ name: 'Ellipse S', icon: faCircle, type: ShapeType.EllipseStroke },
		{ name: 'Ellipse F', icon: faCircleFill, type: ShapeType.EllipseFull },
		{ name: 'Line', icon: faWindowMinimize, type: ShapeType.Line },
		{ name: 'Eraser', icon: faEraser, type: 'Eraser' },
	]

	console.log(shapes)

	return (
		<div style={{
			backgroundColor: 'black',
			position: 'absolute',
			width: '3.5rem',
			height: '3.5rem',
			borderRadius: '4rem',
			bottom: -10,
			right: -10,
		}}>
			{customDrawState.selectedShape}
		</div>
	)
}

function ColorSelection(): JSX.Element {
	const { updateDrawState } = useContext(EngineContext);

	const setColor = (color: Color): void => {
		updateDrawState({ color });
	};

	return (
		<div className='flex flex-row flex-wrap justify-around' 
			style={{ marginBottom: '15px' }}>
			{colors.map((color) => (
				<button onClick={() => setColor(color)} style={{ marginBottom: '10px' }} key={color.toRgb()}>
					<div className='border-2 border-opacity-50 border-black-black' style={{
						width: '35px',
						height: '35px',
						borderRadius: '10px',
						backgroundColor: color.toRgb(),
					}}>
					</div>
				</button >
			))}
		</div>
	);
}

function ThicknessSlider(): JSX.Element {
	const [range, setRange] = useState<number>(100);
	const { customDrawState, updateDrawState } = useContext(EngineContext);

	useEffect(() => {
		setRange(customDrawState.thickness * 10);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const setThickness = (event: ChangeEvent<HTMLInputElement>): void => {
		const value = Number(event.currentTarget.value);
		setRange(value);
		updateDrawState({ thickness: value / 10 });
	};

	return (
		<div style={{ marginBottom: '15px' }}>
			<h5>Thickness</h5>
			<input className='w-24' value={range} min="10" max="100" step="30" onChange={setThickness} type="range"></input>
		</div>
	);
}

function OpacitySlider(): JSX.Element {
	const [range, setRange] = useState<number>(100);
	const { customDrawState, updateDrawState } = useContext(EngineContext);

	useEffect(() => {
		setRange(customDrawState.opacity * 100);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const setOpacity = (event: ChangeEvent<HTMLInputElement>): void => {
		const value = Number(event.currentTarget.value);
		setRange(value);
		updateDrawState({ opacity: value / 100});
	};

	return (
		<div>
			<h5>Opacity</h5>
			<input className='w-24' value={range} min="10" max="100" step="30" onChange={setOpacity} type="range"></input>
		</div>
	);
}

export default function RightToolBox(): JSX.Element {
	return (
		<div className='flex flex-col items-center'
			style={{
				padding: '20px 10px',
			}}
		>
			<SelectionSummary />
			<ColorSelection />
			<ThicknessSlider />
			<OpacitySlider />
		</div>
	);
}
