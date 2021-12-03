module.exports = {
	purge: [
		'./src/pages/**/*.{js,ts,jsx,tsx}',
		'./src/components/**/*.{js,ts,jsx,tsx}',
	],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			fontFamily: {
				'rubik': ['Rubik'],
				'rubik-bold': ['Rubik-Bold'],
				'rubik-extra-bold': ['Rubik-ExtraBold'],
				'rubik-black': ['Rubik-Black'],
			},
		},
		colors: {
			blue: {
				'darker-blue': '#004063',
				200: '#007391',
				'blue': '#006DBB',
				'light-blue': '#00BAE3',
				'lighter-blue': '#33C5F5',
			},
			black: {
				'black': '#000000',
			},
			grey: {
				'grey': '#4D4D4D',
				'light-grey': '#42788F',
			},
			pink: {
				'dark-pink': '#ED1E79',
				'light-pink': '#FF7BAC',
			},
			yellow: {
				'dark-yellow': '#CCAC0F',
				'light-yellow': '#FFE500',
			},
			white: {
				'white': '#FFFFFF',
			},
		},
		animation: {
			'spin-bezier': 'spin 1s cubic-bezier(.20, 1, .8, .5) infinite',
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
	safelist: [
		'bg-blue-darker-blue',
		'bg-grey-light-grey',
		'bg-pink-dark-pink',
		'cursor-default',
		'flex-1',
		'h-8',
		'hover:bg-blue-blue',
		'hover:bg-pink-light-pink',
		'mb-2',
		'mb-5',
		'mb-6',
		'ml-2',
		'ml-3.5',
		'mr-2',
		'mr-3.5',
		'mt-2',
		'mt-6',
		'p-4',
		'pb-1',
		'pb-5',
		'pl-4',
		'pr-3',
		'pr-4',
		'pt-1',
		'pt-5',
		'ring-2',
		'ring-yellow-light-yellow',
		'text-grey-grey',
		'text-white-white',
		'text-yellow-light-yellow',
	],
}
