import React, { CSSProperties } from 'react'

interface RuleItemSpec {
	id: number,
	title: string,
	content?: string,
}

const roundNumberStyle: CSSProperties = {
	width: '3rem',
	height: '3rem',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	background: 'white',
	borderRadius: '50%',
	lineHeight: 0,
	fontSize: '32px',
}

const RuleItem = (props: RuleItemSpec): JSX.Element => {
	return (
		<div className="w-full flex">
			<div>
				<div style={roundNumberStyle} className="text-blue-blue font-black">
					{props.id}
				</div>
			</div>
			<div className="w-full bg-blue-darker-blue rounded-md p-3 ml-4">
				<div className="text-lg font-semibold text-white-white mb-1">{props.title}</div>
				<div className="text-sm text-white-white">{props.content}</div>
			</div>
		</div>
	)
}

export default RuleItem;
