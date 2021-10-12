import React from 'react';
import Layout from '../Layout/Layout';
import Title from '../Title/Title';

export default function Loading(): JSX.Element {
	// TODO : make a true loader
    return(
		<Layout><Title>Loading...</Title></Layout>
	)
}