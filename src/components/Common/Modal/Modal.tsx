import React, { ReactNode } from 'react';
import { SectionTitle } from '..';
import { useTranslation } from 'react-i18next';
import Button from '../Button/Button';

import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import Box from '../Box/Box';

interface ModalProps {
	visible: boolean;
	children: ReactNode,
	onClose: (() => void);
	closeButtonTranslationKey?: string | undefined;
	onValidate: (() => void);
	validateButtonTranslationKey?: string | undefined;
	disabledValidate?: boolean;
}

Modal.defaultProps = {
	closeButtonTranslationKey: 'modal.close',
	validateButtonTranslationKey: 'modal.validate',
}

export default function Modal(props: ModalProps): JSX.Element {
	const { t } = useTranslation();

	return props.visible ? (
		<>
			<div
				className="overflow-x-hidden overflow-y-auto fixed inset-0 z-10 opacity-50 bg-black-black"
			>
			</div>
			<div
				className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-20 outline-none focus:outline-none"
			>
				<div className="relative">
					<div className="rounded-lg shadow-lg relative flex flex-col bg-gradient-to-r from-blue-blue to-blue-light-blue">
						<div className="pl-10 pr-10 rounded-t">
							<SectionTitle hintColor="text-yellow-light-yellow">{t('lobbyView.editProfileBtnLabel')}</SectionTitle>
						</div>
						<div className="relative pl-10 pr-10 flex-auto">
							{props.children}
						</div>
						<div className="flex items-center pl-10 pr-10 pb-6 justify-end">
							<Box mr={2}>
								<Button
									color='primary'
									size='medium'
									icon={faTimes}
									onClick={() => props.onClose()}
								>
									{t(props.closeButtonTranslationKey)}
								</Button>
							</Box>
							<Button
								color='primary'
								size='medium'
								icon={faCheck}
								onClick={() => props.onValidate()}
								disabled={props.disabledValidate}
							>
								{t(props.validateButtonTranslationKey)}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	) : null;
}
