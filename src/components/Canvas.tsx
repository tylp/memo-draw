import React, { useEffect, useRef, useState } from 'react'
import { ICanvas } from './Canvas.spec'

const Canvas = (props: ICanvas): React.ReactNode => {
	const canvasRef = useRef(null)
	const contextRef = useRef(null)
	const [isDrawing, setIsDrawing] = useState(false)
	const [, setSize] = useState({w: 0, h:0})
	const [prevCoords, setPrevCoords] = useState({x: 0, y: 0})
	const [currCoords, setCurrCoords] = useState({x: 0, y: 0})

	useEffect(() => {
		if(props.broadcastedCoords)
			drawFromSocket(props.broadcastedCoords);

	}, [props.broadcastedCoords])

	useEffect(() => {
		setSize({w: window.innerWidth, h: window.innerHeight});
		const canvas = canvasRef.current;
		const scale = 1;
		canvas.style.width = `${canvas.width}px`;
		canvas.style.height = `${canvas.height}px`;
		canvas.width = canvas.width * scale;
		canvas.height = canvas.height * scale;

		const context = canvas.getContext('2d');
		context.scale(scale, scale)
		context.lineCap = 'round'
		context.strokeStyle = 'black'
		context.lineWidth = 4
		contextRef.current = context;
	}, [])

	function throttle(callback, wait, immediate = false) {
		let timeout = null 
		let initialCall = true
		return function() {
			const callNow = immediate && initialCall
			const next = () => {
				// Disabling because this component is gonna be removed soon
				// eslint-disable-next-line prefer-rest-params
				callback.apply(this, arguments)
				timeout = null
			}
			if (callNow) {
				initialCall = false
				next()
			}
			if (!timeout) {
				timeout = setTimeout(next, wait)
			}
		}
	}

	const startDrawing = (e) => {
		const canvas = canvasRef.current
		setPrevCoords({x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop});
		setCurrCoords({x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop});
		setIsDrawing(true);
	}

	const onMouseMove = throttle((e) => {		
		if (!isDrawing) return;
		draw(e)
	}, 10);

	const draw = (e) => {
		const canvas = canvasRef.current
		setPrevCoords(currCoords);
		setCurrCoords({x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop});
		contextRef.current.beginPath();
		contextRef.current.moveTo(prevCoords.x, prevCoords.y);
		contextRef.current.lineTo(currCoords.x, currCoords.y);
		contextRef.current.closePath();
		contextRef.current.stroke();

		// const w = canvas.width;
		// const h = canvas.height;

		props.emitCoords({prevX: prevCoords.x, prevY: prevCoords.y, currX: currCoords.x, currY: currCoords.y});
	}

	const stopDrawing = () => {
		setIsDrawing(false);
	}

	const drawFromSocket = (drawingCoord) => {
		contextRef.current.beginPath();
		contextRef.current.moveTo(drawingCoord.prevX, drawingCoord.prevY);
		contextRef.current.lineTo(drawingCoord.currX, drawingCoord.currY);
		contextRef.current.closePath();
		contextRef.current.stroke();
	}

	return (
		<canvas
			id="canvas"
			width={props.width}
			height={props.height}
			style={{backgroundColor: '#f0eddf'}}
			ref={canvasRef}
			onMouseDown={startDrawing}
			onMouseUp={stopDrawing}
			onMouseMove={onMouseMove}
			onMouseOut={stopDrawing}
		/>
	)
}

export default Canvas
