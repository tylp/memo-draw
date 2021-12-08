import React, { CSSProperties, useEffect, useRef } from 'react';
import { Engine } from 'memo-draw-engine';

// Util function used to trigger when a component is fully painted
// Sources:
// https://stackoverflow.com/a/34999925
// https://github.com/facebook/react/issues/20863
function onPainted(callback) {
	window.requestAnimationFrame(() => {
		setTimeout(() => { callback(); }, 0);
	});
}

interface CanvasProps {
	engine: Engine;
	setEngine: React.Dispatch<React.SetStateAction<Engine>>
}

export default function Canvas({ engine, setEngine }: CanvasProps): JSX.Element {
	const canvasRef = useRef<HTMLCanvasElement>();

	useEffect(() => {
		if (!setEngine) return;

		const engine = new Engine(canvasRef.current);
		setEngine(engine);
	}, [setEngine]);

	useEffect(() => {
		if (!engine) return;

		// Manually update bounds when component is painted
		// Needed to correctly handle mouse position on canvas
		onPainted(() => { engine.canvasManager.updateBounds(); });
	}, [engine])

	const commonCanvasStyle: CSSProperties = {
		width: '100%', 
		height: '100%',
		position: 'absolute', 
		borderRadius: '0.5em',
	}

	return (
		<div style={{ width: '100%', aspectRatio: '8/6', position: 'relative' }}>
			<div style={{
				backgroundColor: 'white',
				backgroundPosition: 'center',
				zIndex: 0,
				...commonCanvasStyle,
			}}></div>
			<canvas style={{ zIndex: 2, ...commonCanvasStyle }} ref={canvasRef} />
		</div>
	);
}
