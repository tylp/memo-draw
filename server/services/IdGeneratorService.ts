const cryptoRand = require('crypto');

export default class IdGeneratorService {
    static generate(): string {
        return cryptoRand.randomBytes(8).toString("hex");
    }
}