/*
*    JavaScript Autocomplete
*    Author: Vladimir Chernov
*    For KeepSolid Summer Internship 2017
*/
/*jslint esversion: 6 */

import { ToDoListItem } from "./todoListItem.js";

export const ToDoListDefault = {
	editable: true,
	removable: true,
	removeBtnText: '&times;',
	allowAdding: true,
	addInputPlaceholder: 'To do:',
	/* by default if addForm is not set new form will be automatically created
	* and added into listElement.parentNode before listElement */
	addForm: {
		form: '', // DOM Element
		input: '', // DOM Element
		submitBtn: '' // DOM Element
	}
};

export class ToDoList {

	constructor(list, data, options) {

		this.options = Object.assign({}, ToDoListDefault, options);

		this.listElement = list; // DOM Element
		this.todoList = []; // data is set in setList(data) {}
		this.addForm = {}; // contains .form, .input and .submitBtn DOM Elements

		this.setList(data);
		if (this.options.allowAdding) { this.createAddingForm(); }

		this.initHandlers();
	}

	setList(data) {
		data.forEach((todo) => {
			let item = new ToDoListItem(todo.text, todo.complete, this.options);
			this.add(item);
		});
	}

	createAddingForm() {
		if (this.options.addForm.form && this.options.addForm.input && this.options.addForm.submitBtn) {
			// set from options if is set
			this.addForm.form = this.options.addForm.form;
			this.addForm.input = this.options.addForm.input;
			this.addForm.submitBtn = this.options.addForm.submitBtn;
		} else {
			// create new if is not set
			this.addForm.input = document.createElement('input');
			this.addForm.input.type = 'text';

			this.addForm.fc = document.createElement('div');
			this.addForm.fc.classList.add('form-control');
			this.addForm.fc.appendChild(this.addForm.input);

			this.addForm.submitBtn = document.createElement('button');
			this.addForm.submitBtn.type = 'submit';
			this.addForm.submitBtn.innerHTML = 'Submit';
			this.addForm.submitBtn.classList.add('btn');

			this.addForm.form = document.createElement('form');
			this.addForm.form.classList.add('todolist--add-form');
			this.addForm.form.appendChild(this.addForm.fc);
			this.addForm.form.appendChild(this.addForm.submitBtn);

			this.listElement.parentNode.insertBefore(this.addForm.form, this.listElement);
		}
		this.addForm.input.placeholder = this.options.addInputPlaceholder;
	}

	initHandlers() {
		if (this.options.allowAdding) {
			this.addForm.form.addEventListener('submit', this.checkValue.bind(this));
		}
		this.todoList.forEach(item => {
			if (this.options.removable) {
				item.removeBtn.addEventListener('click', this.removeTodo.bind(this, item));
			}
		});
	}

	removeTodo(item) {
		let index = this.todoList.indexOf(item);
		this.todoList.splice(index, 1);
	}

	add(item) {
		this.listElement.appendChild(item.elem);
		this.todoList.push(item);
	}

	checkValue(event) {
		event.preventDefault();

		let value = this.addForm.input.value;
		if (value) {
			let item = new ToDoListItem(this.addForm.input.value, false, this.options);
			this.add(item);
			this.options.onAdd && this.options.onAdd.call(this, true);
		} else {
			this.options.onAdd && this.options.onAdd.call(this, false);
		}

		this.addForm.input.value = '';
	}

}
