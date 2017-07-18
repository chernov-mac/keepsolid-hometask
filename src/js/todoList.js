/*
*    JavaScript Autocomplete
*    Author: Vladimir Chernov
*    For KeepSolid Summer Internship 2017
*/
/*jslint esversion: 6 */

import { ToDoListItem } from "./todoListItem.js";

export const ToDoListDefault = {
	editable: true,
	singleLine: true,
	removable: true,
	removeBtnText: '&times;',
	allowAdding: true,
	addInputPlaceholder: 'To do:',
	/* by default if addForm is not set new form will be automatically created
	* and added into listElement.parentNode before listElement */
	addForm: {
		form: null, // DOM Element
		input: null, // DOM Element
		submitBtn: null // DOM Element
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
			let item = new ToDoListItem(todo.text, todo.complete, this);
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
			this.addForm.form.addEventListener('submit', this.onAddTodo.bind(this));
		}
		this.listElement.addEventListener('removeTodo', this.onRemoveTodo.bind(this));
	}

	onRemoveTodo(event) {
		let item = event.detail.item;
		let index = this.todoList.indexOf(item);
		this.todoList.splice(index, 1);
	}

	add(item) {
		this.listElement.appendChild(item.elem);
		this.todoList.push(item);
	}

	onAddTodo(event) {
		event.preventDefault();

		let value = this.addForm.input.value,
			item = null;

		if (value) {
			item = new ToDoListItem(value, false, this);
			this.add(item);
		}
		this.addForm.input.value = '';

		this.options.onAddTodo && this.options.onAddTodo.call(this, item);
	}

}
