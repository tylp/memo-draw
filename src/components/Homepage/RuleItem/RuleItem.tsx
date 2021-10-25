import React from 'react'
import { Col, Row } from 'react-grid-system';

interface RuleItemSpec {
	id: number,
	title: string,
	content?: string,
}

const RuleItem = (props: RuleItemSpec): JSX.Element => {
	return (
		<Row>
			<Col>
				<div className="w-full flex">
					<div className="items-center text-center bg-white-white rounded-full h-12 w-12">
						<div className="text-blue-blue font-black text-4xl">{props.id}</div>
					</div>
					<div className="w-full bg-blue-darker-blue rounded-md p-3 ml-4">
						<div className="text-lg font-semibold text-white-white mb-1">{props.title}</div>
						<div className="text-sm text-white-white">{props.content}</div>
					</div>
				</div>
			</Col>
		</Row>
	)
}

export default RuleItem;
