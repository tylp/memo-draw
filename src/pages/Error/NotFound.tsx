import React from 'react'
import { useTranslation } from 'react-i18next';
import Error from './Error'

export default function NotFound(): JSX.Element {
	const { t } = useTranslation();

	return <Error code={404} title={t('errors.404')} />;
}