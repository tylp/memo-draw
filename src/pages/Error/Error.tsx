import React from 'react';
import { Col, Hidden, Row } from 'react-grid-system';
import { useTranslation } from 'react-i18next';
import AvatarFactory from 'server/factories/AvatarFactory';
import { FaceType } from 'server/interfaces/IProfile';
import { Avatar, Box, Button, Layout } from 'src/components/Common';
import { useHistory } from 'react-router-dom';

interface ErrorProps {
	code: number;
	title: string;
}

export default function Error(props: ErrorProps): JSX.Element {
	const { t } = useTranslation();

	const history = useHistory();

	return (
		<Layout>
			<Row>
				<Hidden xs={true} sm={true} md={true}>
					<Col sm={12} md={6}>
						<Avatar avatar={{ ...AvatarFactory.create(), ...{ faceType: FaceType.Sad } }}></Avatar>
					</Col>
				</Hidden>
				<Col sm={12} lg={6}>
					<p style={{
						fontSize: '5rem',
						color: 'white',
					}}>
						{props.code}
					</p>
					<p style={{
						fontSize: '3rem',
						color: 'white',
					}}>
						{props.title}
					</p>
					<Box mt={2}>
						<Button onClick={() => history.push('/')} size="large" color="primary">{t('errors.goBackHome')}</Button>
					</Box>
				</Col>
			</Row>
		</Layout>
	)
}