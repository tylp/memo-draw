/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useSnackbar } from 'react-simple-snackbar';

const defaultOptions = {
	'position': 'bottom-left'
}

const useDefaultUseSnackbar = (options = {}) => useSnackbar({
	...defaultOptions,
	...options
})

export const useDangerSnackbar = () => useDefaultUseSnackbar({
	style: {
		backgroundColor: '#d74545',
	},
});

export const useWarningSnackbar = () => useDefaultUseSnackbar({
	style: {
		backgroundColor: '#f68a1c',
	},
});

export const useInfoSnackbar = () => useDefaultUseSnackbar({
	style: {
		backgroundColor: '#1d95d6',
	},
});

export const useSuccessSnackbar = () => useDefaultUseSnackbar({
	style: {
		backgroundColor: '#4d9a51',
	},
});