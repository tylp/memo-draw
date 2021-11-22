import { Color } from '../types/Color';
import { Size } from '../types/Size';

export default abstract class StyleBuilder {
	private color: Color | 'disabled';
	private size: Size;
	private isSelected = false;
	private result = '';

	constructor(color: Color | 'disabled' = 'primary', size: Size = 'medium') {
		this.color = color;
		this.size = size;
	}

	buildColor(): this {
		switch (this.color) {
			case 'disabled':
				this.result += 'bg-grey-light-grey text-grey-grey';
				break;
			case 'primary':
				this.result += 'bg-pink-dark-pink text-white-white';
				break;
			case 'secondary':
				this.result += 'bg-blue-darker-blue text-yellow-light-yellow';
				break;
			case 'light-secondary':
				this.result += 'bg-grey-light-grey text-white-white';
				break;
			default:
				throw new Error('Color not found.')
		}
		this.addSeparator()
		this.buildSelected();
		return this;
	}

	buildSelected(): this {
		if (this.isSelected) {
			this.result += ' ring-yellow-light-yellow ring-2';
			this.addSeparator()
		}
		return this;
	}

	buildHover(): this {
		switch (this.color) {
			case 'disabled':
				this.result += 'cursor-default';
				break;
			case 'primary':
				this.result += 'hover:bg-pink-light-pink';
				break;
			case 'secondary':
				this.result += 'hover:bg-blue-blue';
				break;
			case 'light-secondary':
				this.result += 'hover:bg-blue-blue';
				break;
			default:
				throw new Error('Color not found.')
		}

		return this;
	}

	buildSize(): this {
		switch (this.size) {
			case 'small':
				this.result += 'pl-4 pr-3 h-8';
				break;
			case 'medium':
				this.result += 'pl-4 pr-4 pt-1 pb-1';
				break;
			case 'large':
				this.result += 'pt-5 pb-5 pl-4 pr-4 h-20';
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
		return this.result.trim();
	}

	setIsSelected(value: boolean): this {
		this.isSelected = value;
		return this;
	}
}