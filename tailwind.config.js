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
}
