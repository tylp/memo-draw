import { Color } from '../types/Color';
import { Size } from '../types/Size';

export default class StylingBuilder {

	private color: Color | 'disabled';
	private size: Size;
	private result = '';

	constructor(color: Color | 'disabled', size: Size) {
		this.color = color;
		this.size = size;
	}

	buildColor(): StylingBuilder {
		switch (this.color) {
			case 'disabled':
				this.result += 'bg-grey-light-grey text-grey-grey cursor-default';
				break;
			case 'primary':
				this.result += 'bg-pink-dark-pink hover:bg-pink-light-pink text-white-white';
				break;
			case 'secondary':
				this.result += 'bg-blue-darker-blue hover:bg-blue-blue text-yellow-light-yellow';
				break;
			case 'light-secondary':
				this.result += 'bg-grey-light-grey hover:bg-blue-blue text-white-white';
				break;
			default:
				throw new Error('Color not found.')
		}
		this.addSeparator()
		return this;
	}

	buildSize(): StylingBuilder {
		switch (this.size) {
			case 'small':
				this.result += 'pl-4 pr-3 h-8';
				break;
			case 'medium':
				this.result += 'pl-4 pr-4 pt-1 pb-1';
				break;
			case 'large':
				this.result += 'pt-5 pb-5 pl-4 pr-4';
				break;
			default:
				throw new Error('Size not found.')
		}
		this.addSeparator()
		return this;
	}

	private addSeparator() {
		this.result += ' ';
	}

	getResult(): string {
		return this.result;
	}

}