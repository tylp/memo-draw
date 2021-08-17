import FakeNameGeneratorService from "./FakeNameGeneratorService";

describe("FakeNameGeneratorService", () => {
	test("generate should work", () => {
		const generatedName = FakeNameGeneratorService.generate();
		expect(generatedName.length).toBeGreaterThan(0);
	});
});