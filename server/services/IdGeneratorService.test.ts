import IdGeneratorService from './IdGeneratorService';

describe('IdGeneratorService', () => {
	test('generate should work', () => {
		const listOfIds = [];
		const TESTED_ID_LENGTH = 10000;

		for(let i = 0; i < TESTED_ID_LENGTH; i++) {
			listOfIds.push(IdGeneratorService.generate())
		}
		const uniq = [...new Set(listOfIds)];
		expect(uniq.length).toBe(TESTED_ID_LENGTH);
	});
});