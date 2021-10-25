import React from 'react';
import { Layout, Loading } from '..';
import Box from '../Box/Box';

export default function LoadingFull(): JSX.Element {
	return (
		<Layout>
			<Box p={4}>
				<Loading />
			</Box>
		</Layout>
	)
}