import React, { ReactNode } from 'react';
import { SectionTitle } from '..';
import { useTranslation } from 'react-i18next';
import Button from '../Button/Button';

import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import Box from '../Box/Box';

interface ModalProps {
	title: string;
	visible: boolean;
	children: ReactNode,
	onClose?: (() => void) | undefined;
	closeButtonTranslationKey?: string | undefined;
	onValidate?: (() => void) | undefined;
	validateButtonTranslationKey?: string | undefined;
	disableValidate?: boolean;
	showValidate?: boolean;
	disableCancel?: boolean;
	showCancel?: boolean;
}

Modal.defaultProps = {
	closeButtonTranslationKey: 'modal.close',
	validateButtonTranslationKey: 'modal.validate',
	disableValidate: false,
	showValidate: true,
	showCancel: true,
}

export default function Modal(props: ModalProps): JSX.Element {
	const { t } = useTranslation();

	return props.visible && (
		<>
			<div className="fixed inset-0 z-10 opacity-50 bg-black-black">
			</div>
			<div className="flex justify-center items-center fixed inset-0 z-20">
				<div className="flex flex-col rounded-lg shadow-lg bg-gradient-to-r from-blue-blue to-blue-light-blue">
					<div className="w-auto md:w-96 px-10 py-6">
						<div className="mb-5">
							<SectionTitle hintColor="text-yellow-light-yellow">{props.title}</SectionTitle>
						</div>
						{props.children}
						<div className="flex justify-center">
							{props.showCancel && (
								<Box mr={2}>
									<Button
										color='primary'
										size='medium'
										icon={faTimes}
										onClick={() => props?.onClose()}
										disabled={props.disableCancel}
									>
										{t(props.closeButtonTranslationKey)}
									</Button>
								</Box>
							)}
							{props.showValidate && (
								<Button
									color='primary'
									size='medium'
									icon={faCheck}
									onClick={() => props?.onValidate()}
									disabled={props.disableValidate}
								>
									{t(props.validateButtonTranslationKey)}
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
