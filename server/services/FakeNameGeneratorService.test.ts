import FakeNameGeneratorService from './FakeNameGeneratorService';
import ProfileValidatorService from './ProfileValidatorService';

describe('FakeNameGeneratorService', () => {
	test('generate should work', () => {
		const generatedName = FakeNameGeneratorService.generate();
		expect(generatedName.length).toBeGreaterThan(0);
	});

	test('all names should be valid', () => {
		FakeNameGeneratorService.NAMES.forEach((name) => {
			expect(ProfileValidatorService.validateUsername(name)).toBeTruthy();
		})
	})
});