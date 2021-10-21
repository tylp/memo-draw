import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
const resources = {
	en: {
		translation: {
			'alert': {
				'youGotKicked': 'You got kicked.',
				'roomDoesNotExist': 'Room does not exist.',
				'leavedLobby': 'You leaved the room.',
				'haventJoinedRoomYet': 'You haven\'t joined a room yet.',
			},
			'homepage': {
				'start': 'Done !',
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
				},
				'profile': {
					'title': 'Who are you?',
					'subtitle': 'Hey there!'
				}
			},
			'profileSelector': {
				'title': 'Avatar',
				'eraser': 'Eraser',
				'color': 'Color',
				'face': 'Face',
				'randomize': 'Randomize',
				'nickname': 'Nickname'
			},
			'gameView': {
				'playersTitle': 'Players',
				'sendDrawing': 'Send Drawing'
			},
			'lobbyView': {
				'playersTitle': 'Players',
				'inviteBtnLabel': 'Invite',
				'successfullyCopied' : 'Invite link copied !',
				'leaveBtnLabel': 'Leave room',
				'gameTitle': 'Game',
				'startBtnLabel': 'Start'
			},
			'userCard': {
				'badge': 'It\'s you'
			},
            'speeds': {
                '0': 'Normal',
            },
            'gameModes': {
                '0': 'Classic'
            }
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