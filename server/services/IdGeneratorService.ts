import { randomBytes } from 'crypto';

export default class IdGeneratorService {
	static generate(): string {
		return randomBytes(8).toString('hex');
	}
}