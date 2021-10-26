import Application from '../../classes/Application';

export default class ResetableApplication extends Application {
	static reset(): void {
		Application.instance = new Application();
	}
}