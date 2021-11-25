import { ShapeType } from 'memo-draw-engine';
import React, { CSSProperties, useContext } from 'react';
import { CustomShapeType, EngineContext } from './EngineContext';


import { faUndoAlt, faRedoAlt, faPen, faFill, faSquare as faSquareFill, faCircle as faCircleFill, faGripLines, faEraser } from '@fortawesome/free-solid-svg-icons';
import { faSquare as faSquare, faCircle, faWindowMinimize } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '../../../Common/Box/Box';

interface ShapeInfo {
	name: string,
	icon: any,
	select: () => void,
}

const buttonStyle: CSSProperties = {
	margin: '0 4px',
	border: '1px solid rgba(255, 255, 255, .15)',
	padding: '4px 6px',
	borderRadius: '4px',
};

function ShapesSelection(): JSX.Element {
	const { updateDrawState } = useContext(EngineContext);

	const setShape = (shapeType: CustomShapeType) => {
		updateDrawState({ selectedShape: shapeType });
	};

	const shapes: Array<ShapeInfo> = [
		{ name: 'Pencil', icon: faPen, select: () => setShape(ShapeType.Pencil) },
		{ name: 'Fill', icon: faFill, select: () => setShape(ShapeType.Fill) },
		{ name: 'Rectangle S', icon: faSquare, select: () => setShape(ShapeType.RectangleStroke) },
		{ name: 'Rectangle F', icon: faSquareFill, select: () => setShape(ShapeType.RectangleFull) },
		{ name: 'Ellipse S', icon: faCircle, select: () => setShape(ShapeType.EllipseStroke) },
		{ name: 'Ellipse F', icon: faCircleFill, select: () => setShape(ShapeType.EllipseFull) },
		{ name: 'Line', icon: faWindowMinimize, select: () => setShape(ShapeType.Line) },
		{ name: 'Eraser', icon: faEraser, select: () => setShape('Eraser') },
	]

	return (
		<>
			{shapes.map((shape) => {
				return (
					<button style={buttonStyle} key={shape.name} onClick={shape.select}	>
						<Box pl={1} pr={1}>
							<FontAwesomeIcon icon={shape.icon} />
						</Box>
					</button>
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
		<div className="flex flex-row justify-around">
			<button style={buttonStyle} onClick={() => undo()}>
				<Box pl={1} pr={1}>
					<FontAwesomeIcon icon={faUndoAlt} />
				</Box>
			</button>
			<button style={buttonStyle} onClick={() => redo()}>
				<Box pl={1} pr={1}>
					<FontAwesomeIcon icon={faRedoAlt} />
				</Box>
			</button>
		</div>
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
		<div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
			<UndoRedoSelection />
			<VerticalDivider />
			<ShapesSelection />
		</div>
	);
}