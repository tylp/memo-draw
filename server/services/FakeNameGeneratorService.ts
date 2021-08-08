export default class FakeNameGeneratorService {
    static NAMES = [
        "Charles",
        "Xavier",
        "Nicolas"
    ];

    static generate(): string {
        return this.NAMES[Math.floor(Math.random() * this.NAMES.length)];
    }
}