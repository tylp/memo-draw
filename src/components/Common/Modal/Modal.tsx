import React, { ReactNode } from 'react';
import { SectionTitle } from '..';
import { useTranslation } from 'react-i18next';
import Button from '../Button/Button';

interface ModalProps {
	visible: boolean;
	children: ReactNode,
	onClose: (() => void);
	closeButtonTranslationKey?: string | undefined;
	onValidate: (() => void);
	validateButtonTranslationKey?: string | undefined;
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
				className="overflow-x-hidden overflow-y-auto fixed inset-0 z-40 opacity-50 bg-black-black"
			>
			</div>
			<div
				className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
			>
				<div className="relative">
					<div className="rounded-lg shadow-lg relative flex flex-col bg-gradient-to-r from-blue-blue to-blue-light-blue">
						<div className="pl-10 pr-10 rounded-t">
							<SectionTitle hintColor="text-yellow-light-yellow">{t('lobbyView.editProfileBtnLabel')}</SectionTitle>
						</div>
						<div className="relative pl-10 pr-10 flex-auto">
							{props.children}
						</div>
						<div className="flex items-center justify-end p-6">
							<Button
								color='primary'
								size='medium'
								onClick={() => props.onClose()}
							>
								{t(props.closeButtonTranslationKey)}
							</Button>
							<Button
								color='primary'
								size='medium'
								onClick={() => props.onValidate()}
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
