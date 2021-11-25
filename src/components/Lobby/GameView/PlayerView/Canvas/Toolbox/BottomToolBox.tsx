import { ShapeType } from 'memo-draw-engine';
import React, { CSSProperties, useContext } from 'react';
import { CustomShapeType, EngineContext } from './EngineContext';

interface ShapeInfo {
	name: string,
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
		{ name: 'Pencil', select: () => setShape(ShapeType.Pencil) },
		{ name: 'Fill', select: () => setShape(ShapeType.Fill) },
		{ name: 'Rectangle S', select: () => setShape(ShapeType.RectangleStroke) },
		{ name: 'Rectangle F', select: () => setShape(ShapeType.RectangleFull) },
		{ name: 'Ellipse F', select: () => setShape(ShapeType.EllipseFull) },
		{ name: 'Ellipse S', select: () => setShape(ShapeType.EllipseStroke) },
		{ name: 'Line', select: () => setShape(ShapeType.Line) },
		{ name: 'Eraser', select: () => setShape('Eraser') },
	]

	return (
		<>
			{shapes.map((shape) => {
				return (
					<button style={buttonStyle} key={shape.name} onClick={shape.select}	>
						{shape.name}
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
		<div>
			<button style={buttonStyle} onClick={() => undo()}>Undo</button>
			<button style={buttonStyle} onClick={() => redo()}>Redo</button>
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