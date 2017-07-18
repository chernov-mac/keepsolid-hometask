/*
*    JavaScript Autocomplete
*    Author: Vladimir Chernov
*    For KeepSolid Summer Internship 2017
*/
/*jslint esversion: 6 */

export class ToDoListItem {

	constructor(text, complete, listContainer) {

		this.listContainer = listContainer;
		this.options = listContainer.options;

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
		this.textValueBox.innerHTML = value;
		this.input.value = value;
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
		this.textValueBox = document.createElement('div');
		this.textValueBox.classList.add('value');

		this.textBox = document.createElement('div');
		this.textBox.classList.add('todolist-item--text');
		this.textBox.appendChild(this.textValueBox);

		this.input = document.createElement('input');
		this.input.type = 'text';

		this.editValueBox = document.createElement('div');
		this.editValueBox.classList.add('form-control');
		this.editValueBox.classList.add('edit-value');
		this.editValueBox.appendChild(this.input);

		this.elem.appendChild(this.textBox);

		if (this.options.editable) {
			this.textBox.appendChild(this.editValueBox);
		}
	}

	initHandlers() {
		this.checkboxLabel.addEventListener('click', this.toggleComplete.bind(this));
		document.addEventListener('click', this.onBlur.bind(this));

		if (this.options.editable) {
			this.textBox.addEventListener('click', this.onEdit.bind(this));
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

		// dispatch event for handling by ToDoList class
		var removeTodo = new CustomEvent("removeTodo", {
			bubbles: true,
			detail: {
				item: this
			}
		});
		this.listContainer.listElement.dispatchEvent(removeTodo);
	}

	onEdit() {
		this.elem.classList.add('active');
		this.input.focus();
	}

	onBlur() {
		if (event.target != this.textBox && event.target != this.textValueBox && event.target != this.input) {
			this.elem.classList.remove('active');

			if (this.input.value) {
				this.text = this.input.value;
			} else {
				this.input.value = this.text;
			}
		}
	}

}
