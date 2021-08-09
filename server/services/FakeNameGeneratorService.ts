export default class FakeNameGeneratorService {
    static NAMES = [
        "Adrien",
        "Antoine",
        "Cyril",
        "Nathan",
        "Valentin"
    ];

    static generate(): string {
        return this.NAMES[Math.floor(Math.random() * this.NAMES.length)];
    }
}
