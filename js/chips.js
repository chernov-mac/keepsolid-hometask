/*
*    JavaScript Autocomplete
*    Author: Vladimir Chernov
*    For KeepSolid Summer Internship 2017
*/
/*jslint esversion: 6 */

// TODO: options: maxChipsNumber, onlyOnce

class Chips extends Autocomplete {

	constructor(input, data, options) {

		super(input, data, options);
		this.chips = [];

		this.setChipsList();
	}

	setDialogList() {
		super.setDialogList();
		this.markSelectedOptions();
	}

	setChipsList() {
		this.chipsList = document.createElement('div');
		this.chipsList.classList.add('chips-list');
		this.fc.insertBefore(this.chipsList, this.input);

		if (this.chips.length) this.updateChipsList();

		this.chipsList.addEventListener('click', this.chipsClick.bind(this));
	}

	updateChipsList() {
		let removeBtn = this.options.removable ? ' <span class="remove">&times;</span>' : '';
		let classList = this.options.removable ? 'chip removable' : 'chip';

		let list = '';
		this.chips.forEach((chip) => {
			list += `<span class="${classList}" data-val="${chip}">${chip}${removeBtn}</span>`;
		});

		this.chipsList.innerHTML = list;
	}

	addChip(str) {
		let removeBtn = this.options.removable ? ' <span class="remove">&times;</span>' : '';
		let classList = this.options.removable ? 'chip removable' : 'chip';

		let chip = `<span class="${classList}" data-val="${str}">${str}${removeBtn}</span>`;
		this.chipsList.innerHTML += chip;
	}

	removeChip(el) {
		let chip = el.closest('.chip');
		let removeValue = chip.getAttribute('data-val');
		chip.remove();

		let index = null;
		for(let i = 0; i < this.chips.length; i++) {
			if (this.chips[i] === removeValue) {
				index = i;
				break;
			}
		}
		index && this.chips.splice(index, 1);
		this.setDialogList();
		this.markSelectedOptions();
	}

	// How make this work after setDialogList?
	markSelectedOptions() {
		let options = this.suggestions.querySelectorAll('.option');
		options.forEach((option) => {
			let value = option.getAttribute('data-val');
			if (this.chips.includes(value)) this.markOption(option); // error: Cannot read property 'contains' of undefined
		});
	}

	markOption(option) {
		option.classList.add('selected');
		option.removeAttribute('tabindex');
	}

	selectOption(option) {
		let str = option.getAttribute('data-val');

		if (this.options.selectOnlyOnce && this.chips.includes(str)) {
			console.log('Options '+str+' is already selected');
		} else {
			this.chips[this.chips.length] = str;
	        str && this.options.onSelect && this.options.onSelect.call(this, this.chips);

			this.markOption(option);
			this.addChip(str);
			this.input.focus();
		}
    }

	chipsClick() {
		if (event.target.classList.contains('remove')) {
			this.removeChip(event.target);
		}
	}

}
