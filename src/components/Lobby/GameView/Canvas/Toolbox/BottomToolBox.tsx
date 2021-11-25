import { ShapeType } from 'memo-draw-engine';
import React, { useContext, useEffect, useState } from 'react';
import { CustomShapeType, EngineContext } from './EngineContext';
import { faUndoAlt, faRedoAlt, faPen, faFill, faSquare as faSquareFill, faCircle as faCircleFill, faEraser } from '@fortawesome/free-solid-svg-icons';
import { faSquare as faSquare, faCircle, faWindowMinimize } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Box } from '../../../../Common';

interface ShapeInfo {
	name: string,
	icon: IconProp,
	type: CustomShapeType,
}

interface btnToolBoxProps {
	selected?: boolean,
	key?: string,
	onClick?: () => void,
	icon: IconProp,
	color: 'blue' | 'yellow',
}

function BtnToolBox(props: btnToolBoxProps): JSX.Element {

	const [color, setColor] = useState('');

	useEffect(() => {
		if (props.selected) {
			setColor('white-white bg-blue-200');
		} else {
			setColor(props.color == 'blue' ? 'blue-light-blue ' : props.color == 'yellow' ? 'yellow-light-yellow ' : '');
		}
	}, [props.color, props.selected]);

	return (
		<button className={`rounded-lg border-2 border-${color}`} key={props.key} onClick={props.onClick}>
			<Box ml={3.5} mr={3.5} mt={2} mb={2}>
				<span className={`text-2xl text-${color}`}>
					<FontAwesomeIcon icon={props.icon} />
				</span>
			</Box>
		</button>
	)
}

function ShapesSelection(): JSX.Element {
	const [toolNameSelected, setToolNameSelected] = useState<CustomShapeType>(ShapeType.Pencil);

	const { updateDrawState } = useContext(EngineContext);

	const setShape = (shapeType: CustomShapeType) => {
		setToolNameSelected(shapeType)
		updateDrawState({ selectedShape: shapeType });
	};

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

	return (
		<>
			{shapes.map((shape) => {
				return (
					<BtnToolBox selected={shape.type == toolNameSelected} color='yellow' icon={shape.icon} key={shape.name} onClick={() => { setShape(shape.type) }} />
				);
			})}
		</>
	);
}

function UndoRedoSelection(): JSX.Element {
	const { engine } = useContext(EngineContext)

	const undo = (): void => {
		engine.shapeManager.internalEventManager.undo();
	};

	const redo = (): void => {
		engine.shapeManager.internalEventManager.redo();
	};

	return (
		<>
			<BtnToolBox icon={faUndoAlt} color='blue' onClick={() => undo()} />
			<BtnToolBox icon={faRedoAlt} color='blue' onClick={() => redo()} />
		</>
	);
}

function VerticalDivider(): JSX.Element {
	return (
		<div style={{
			width: '2px',
			height: '40px',
			background: 'rgba(255, 255, 255, .15)',
			margin: '0 5px',
		}} />
	);
}

export default function BottomToolBox(): JSX.Element {

	return (
		<div className='flex flex-row justify-around items-center m-2'>
			<UndoRedoSelection />
			<VerticalDivider />
			<ShapesSelection />
		</div>
	);
}