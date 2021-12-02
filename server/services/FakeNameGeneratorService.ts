export default class FakeNameGeneratorService {
	static NAMES = [
		'Ritzy Roentgen',
		'Goofy Williams',
		'Busy Goldberg',
		'Agressive Turing',
		'Stoic Poincare',
	];

	static generate(): string {
		return this.NAMES[Math.floor(Math.random() * this.NAMES.length)];
	}
}
