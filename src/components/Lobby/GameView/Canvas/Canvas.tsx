import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { Engine, drawState, ShapeType } from 'memo-draw-engine';

// Util function used to trigger when a component is fully painted
// Sources:
// https://stackoverflow.com/a/34999925
// https://github.com/facebook/react/issues/20863
function onPainted(callback) {
	window.requestAnimationFrame(() => {
		setTimeout(() => { callback(); }, 0);
	});
}

export default function Canvas(): JSX.Element {
	const [backgroundStyle, setBackgroundStyle] = useState<CSSProperties>();
	const canvasRef = useRef<HTMLCanvasElement>();

	useEffect(() => {
		const engine = new Engine(canvasRef.current);
		engine.eventManager.registerDefaultCanvasAndDocumentEvents();
		drawState.shapeType = ShapeType.Pencil;
		drawState.thickness = 5;
		initBackgroundStyle();

		// Manually update bounds when component is painted
		// Needed to correctly handle mouse position on canvas
		onPainted(() => { engine.canvasManager.updateBounds(); });
	}, []);

	const initBackgroundStyle = (): void => {
		setBackgroundStyle({
			position: 'absolute',
			backgroundColor: 'white',
			zIndex: 0,
			width: `${canvasRef.current.width}px`,
			height: `${canvasRef.current.height}px`,
		});
	};

	return (
		<div>
			<div style={backgroundStyle}></div>
			<canvas style={{ zIndex: 2, position: 'relative' }} width="800" height="600" ref={canvasRef}></canvas>
		</div>
	);
}
