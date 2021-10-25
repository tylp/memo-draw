import React, { ReactNode } from 'react';
import Logo from '../Logo/Logo';
import { Container, Row, Col } from 'react-grid-system';
import Box from '../Box/Box';

interface WhiteBorderProps {
	children: ReactNode;
}

function WhiteBorder(props: WhiteBorderProps): JSX.Element {
	return (
		<div className='w-full border-8 border-white-white border-opacity-10 rounded-xl'>
			{props.children}
		</div>
	)
}

interface LayoutSpec {
	children: ReactNode
}


export default function Layout({ children }: LayoutSpec): JSX.Element {
	return (
		<Container fluid className="bg-gradient-to-r from-blue-blue to-blue-light-blue min-h-screen h-100 min-w-full">
			<Row>
				<Col sm={12} xl={10} offset={{ sm: 0, xl: 1 }}>
					<Row>
						<Col>
							<Box py={2} className="flex flex-col justify-center items-center">
								<Logo size='small' />
							</Box>
						</Col>
					</Row>
					<Row>
						<Col>
							<div className='w-full flex flex-col justify-center items-center'>
								<Box py={4} className="w-full">
									<WhiteBorder>
										<Box p={2}>
											{children}
										</Box>
									</WhiteBorder>
								</Box>
							</div>
						</Col>
					</Row>
				</Col>
			</Row>
		</Container>
	)
}