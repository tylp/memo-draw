export class EnumToArray {
	public static treat = (T: unknown): typeof T[] => {
		return Object.values(T)
			.map((value) => value as typeof T)
	}
}