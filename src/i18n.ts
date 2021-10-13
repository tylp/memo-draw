import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
const resources = {
	en: {
		translation: {
			'homepage': {
				'start': 'Done !',
				'randomize': 'Randomize',
				'rules': {
					'title': 'The Game',
					1: {
						'title': 'Rule 1',
						'content': 'Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet...'
					},
					2: {
						'title': 'Rule 2',
						'content': 'Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet...'
					},
					3: {
						'title': 'Rule 3',
						'content': 'Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet...'
					}
				}
			},
		}
	},
};

i18n
	.use(initReactI18next)
	.init({
		resources,
		lng: 'en',
		interpolation: {
			escapeValue: false
		}
	});

export default i18n;