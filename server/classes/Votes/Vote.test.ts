import Vote, { Option, Participant } from './Vote';

describe('Vote', () => {

	let vote: Vote;
	let options: Set<Option>
	let participants: Set<Participant>;

	beforeEach(() => {
		options = new Set(['Vice City', 'San Andreas', 'Five']);
		participants = new Set(['Michael', 'Trevor', 'Franklin']);
		vote = new Vote(participants, options);
	})

	test('vote should set correct vote for correct participant and correct option', () => {
		expect(vote.getVoteOf('Michael')).toBeUndefined();

		vote.vote('Michael', 'Five');

		expect(vote.getVoteOf('Michael')).toBe('Five');
	})

	test('vote should not vote for incorrect participant', () => {
		expect(vote.getVoteOf('Michael')).toBeUndefined();

		vote.vote('Michael', 'Six');

		expect(vote.getVoteOf('Michael')).toBeUndefined();
	})

	test('vote should not vote for incorrect option', () => {
		expect(vote.getVoteOf('Michael')).toBeUndefined();

		vote.vote('Michael', 'Six');

		expect(vote.getVoteOf('Michael')).toBeUndefined();
	})
});