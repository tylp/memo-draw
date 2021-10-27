export default class FakeNameGeneratorService {
	static NAMES = [
		'Suspicious Roentgen',
		'Goofy Williams',
		'Nauseous Goldberg',
		'Agressive Turing',
		'Stoic Poincare',
	];

	static generate(): string {
		return this.NAMES[Math.floor(Math.random() * this.NAMES.length)];
	}
}
