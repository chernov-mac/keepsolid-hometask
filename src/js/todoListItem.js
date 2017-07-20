/*
*    JavaScript Autocomplete
*    Author: Vladimir Chernov
*    For KeepSolid Summer Internship 2017
*/
/*jslint esversion: 6 */

export const TodoListItemDefaults = {
	editable: true,
	removable: true,
	singleLine: true,
	removeBtnText: '<span class="fa fa-times-circle"></span>'
};

export class TodoListItem {

	constructor(text, complete, options) {

		this.parentList = options.parentList;
		this.options = Object.assign({}, TodoListItemDefaults, options);

		this.elem = document.createElement('li');
		this.elem.classList.add('todolist-item');
		if (this.options.editable) { this.elem.classList.add('editable'); }

		this.createButtons();
		this.createTextBox();
		this.initHandlers();

		this.text = text;
		this.complete = complete;
	}

	get text() {
		return this._text;
	}

	set text(value) {
		this._text = value;
		this.textBox.innerHTML = value;
	}

	get complete() {
		return this._complete;
	}

	set complete(value) {
		this._complete = value;

		if (value) {
			this.elem.classList.add('complete');
			this.checkbox.checked = true;
		} else {
			this.elem.classList.remove('complete');
			this.checkbox.checked = false;
		}
	}

	createButtons() {
		this.removeBtn = document.createElement('div');
		this.removeBtn.classList.add('todolist-item--remove');
		this.removeBtn.innerHTML = this.options.removeBtnText;

		this.checkbox = document.createElement('input');
		this.checkbox.type = 'checkbox';

		this.checkboxLabel = document.createElement('label')
		this.checkboxLabel.classList.add('todolist-item--complete');
		this.checkboxLabel.appendChild(this.checkbox);

		this.elem.appendChild(this.checkboxLabel);

		if (this.options.removable) {
			this.elem.appendChild(this.removeBtn);
		}
	}

	createTextBox() {
		this.textBox = document.createElement('div');
		this.textBox.classList.add('todolist-item--text');
		if (this.options.singleLine) {
			this.textBox.classList.add('single-line');
		}

		this.elem.appendChild(this.textBox);

		this.textBox.setAttribute('contenteditable', this.options.editable);
	}

	initHandlers() {
		this.checkboxLabel.addEventListener('click', this.toggleComplete.bind(this));
		document.addEventListener('click', this.onBlur.bind(this));

		if (this.options.editable) {
			this.textBox.addEventListener('focus', this.onEdit.bind(this));
		}
		if (this.options.removable) {
			this.removeBtn.addEventListener('click', this.onRemove.bind(this));
		}
	}

	toggleComplete() {
		this.complete = !this.complete;
	}

	onRemove() {
		this.elem.remove();

		// dispatch event for handling by TodoList class
		var removeTodo = new CustomEvent("removeTodo", {
			bubbles: true,
			detail: {
				item: this
			}
		});
		this.parentList.dispatchEvent(removeTodo);
	}

	onEdit() {
		this.textBox.classList.remove('single-line');
		// this.placeCaretAtEnd();
		this.elem.classList.add('active');
	}

	onBlur() {
		if (event.target != this.textBox) {
			this.elem.classList.remove('active');
			// this.textBox.innerHTML = this.text;

			if (this.textBox.innerHTML) {
				this.text = this.textBox.innerHTML;
			} else {
				this.textBox.innerHTML = this.text;
			}

			if (this.options.singleLine) {
				this.textBox.classList.add('single-line');
			}
		}
	}

	placeCaretAtEnd() {
		var range,selection;
		range = document.createRange();//Create a range (a range is a like the selection but invisible)
		range.selectNodeContents(this.textBox);//Select the entire contents of the element with the range
		range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
		selection = window.getSelection();//get the selection object (allows you to change selection)
		selection.removeAllRanges();//remove any selections already made
		selection.addRange(range);//make the range you have just created the visible selection
	}

}
