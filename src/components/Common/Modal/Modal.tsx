import React, { ReactNode } from 'react';
import { SectionTitle } from '..';
import { useTranslation } from 'react-i18next';

interface ModalProps {
	visible: boolean;
	children: ReactNode,
	onClose?: (() => void) | undefined;
	closeButtonTranslationKey?: string | undefined;
	onValidate?: (() => void) | undefined;
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
				className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
			>
				<div className="relative w-auto my-6 mx-auto max-w-3xl">
					<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white-white outline-none focus:outline-none">
						<div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
							<SectionTitle>bg-blue-darker-blue</SectionTitle>
						</div>
						<div className="relative p-6 flex-auto">
							{props.children}
						</div>
						<div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
							<button
								className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
								type="button"
								onClick={() => props.onClose && props.onClose()}
							>
								{t(props.closeButtonTranslationKey)}
							</button>
							<button
								className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
								type="button"
								onClick={() => props.onValidate && props.onValidate()}
							>
								{t(props.validateButtonTranslationKey)}
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
		</>
	) : null;
}
