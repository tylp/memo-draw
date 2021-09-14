export default class RandomEnumPickerService {
	static pick<T>(anEnum: T): T[keyof T] {
		const enumValues = Object.keys(anEnum) as unknown as T[keyof T][]
		const randomIndex = Math.floor(Math.random() * enumValues.length)
		const enumKey = enumValues[randomIndex] as unknown as keyof T;
		const randomEnumValue = anEnum[enumKey]
		return randomEnumValue;
	}
}