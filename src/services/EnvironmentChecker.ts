/**
 * Because our code is getting read and distributed by our server, we need to check whether the code is
 * currently server side or client side, as the window variable isn't available server side, and fails
 * the code.
 */
export class EnvironmentChecker {
	static isClientSide(): boolean {
		return typeof window !== 'undefined';
	}

	static isServerSide(): boolean {
		return !this.isClientSide();
	}
}