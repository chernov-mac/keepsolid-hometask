/*
*    JavaScript Autocomplete
*    Author: Vladimir Chernov
*    For KeepSolid Summer Internship 2017
*/
/*jslint esversion: 6 */

import { TodoListItem, TodoListItemDefaults } from "./todoListItem.js";

export const TodoListDefaults = {
	allowAdding: true,
	addIconText: '<span class="fa fa-plus-circle"></span>',
	addBoxPlaceholder: 'New todo:',
	customAddForm: null, // DOM Element. Will disable creating adding-item if set
	titleText: null,
	titleEditable: true,
	tools: true,
	removeToolText: '<span class="fa fa-trash"></span>',
	clearToolText: '<span class="fa fa-times-circle"></span>',
	readonly: false,
	desk: null, // DOM Element of main builder element for events assign
	listItem: {} // extends todoListItem default options
};

export class TodoList {

	constructor(element, data, options) {

		this.options = Object.assign({}, TodoListDefaults, options);
		this.options.listItem = Object.assign({}, options.listItem);
		console.log(this.options);
		this.options.listItem.parentList = this.listElement;
		if (this.options.readonly) {
			this.options.allowAdding = false;
			this.options.tools = false;
			this.options.listItem.editable = false;
			this.options.listItem.removable = false;
		}

		this.data = data || [];
		this.todoList = []; // contains objects of TodoListItem
		this.addForm = {}; // contains form with input

		this.listElement = this.createListElement(element);
		this.setList(this.data);
		if (this.options.titleText) {
			this.createTitle();
			this.title = this.options.titleText;
		}
		if (this.options.tools) { this.createTools(); }

		this.initHandlers();
	}

	get title() {
		return this._title;
	}

	set title(value) {
		this._title = value;
		this.titleElement.innerHTML = value;
	}

	setList(data) {
		data = data || [];
		this.todoList = [];
		this.listElement.innerHTML = '';
		data.forEach((todo) => {
			let item = new TodoListItem(todo.text, todo.complete, this.options.listItem);
			this.add(item);
		});
		if (this.options.allowAdding) { this.setAddingForm(); }
	}

	add(item) {
		if (this.options.customAddForm) {
			this.listElement.appendChild(item.elem);
		} else {
			this.listElement.insertBefore(item.elem, this.addElem);
		}

		this.todoList.push(item);
	}

	setAddingForm() {
		if (this.options.customAddForm) {
			// set from options if is set
			this.addForm = this.options.customAddForm;
			this.addInput = this.addForm.querySelector('input');
			this.addForm.addEventListener('submit', this.onAddTodo.bind(this));
		} else {
			this.createAddingItem();
			this.addBox.addEventListener('focus', this.onAddBoxFocus.bind(this));
			this.addBox.addEventListener('input', this.onAddTodo.bind(this));
		}
	}

	createListElement(parent) {
		let listElement = document.createElement('ul');
		listElement.classList.add('todolist--list');
		parent.appendChild(listElement);
		return listElement;
	}

	createTitle() {
		this.titleElement = document.createElement('h5');
		this.titleElement.classList.add('title');
		this.listElement.parentElement.insertBefore(this.titleElement, this.listElement);
		if (this.options.titleEditable) {
			this.titleElement.setAttribute('contenteditable', 'true');
		}
	}

	createAddingItem() {
		let inner = 	`<div class="todolist-item--add-icon">${this.options.addIconText}</div>
						<div class="todolist-item--text single-line">
				            <div class="placeholder">${this.options.addBoxPlaceholder}</div>
				            <div class="adding-box" contenteditable="true"></div>
				        </div>`;

		this.addElem = document.createElement('li');
		this.addElem.classList.add('todolist-item', 'add-item', 'editable');
		this.listElement.appendChild(this.addElem);

		this.addElem.innerHTML = inner;
		this.addBox = this.addElem.querySelector('.adding-box');
	}

	createTools() {
		this.tools = {};

		this.toolsElement = document.createElement('div');
		this.toolsElement.classList.add('todolist--tools');

		this.tools.remove = document.createElement('div');
		this.tools.remove.classList.add('tool', 'remove');
		this.tools.remove.innerHTML = this.options.removeToolText;

		this.tools.clear = document.createElement('div');
		this.tools.clear.classList.add('tool', 'clear');
		this.tools.clear.innerHTML = this.options.clearToolText;

		this.toolsElement.appendChild(this.tools.clear);
		this.toolsElement.appendChild(this.tools.remove);

		this.listElement.parentElement.insertBefore(this.toolsElement, this.listElement);

		this.tools.clear.addEventListener('click', this.onClearList.bind(this));
		this.tools.remove.addEventListener('click', this.onRemoveList.bind(this));
	}

	initHandlers() {
		this.listElement.addEventListener('removeTodo', this.onRemoveTodo.bind(this));
		document.addEventListener('click', this.onBlur.bind(this));
	}

	onRemoveTodo(event) {
		let item = event.detail.item;
		let index = this.todoList.indexOf(item);
		this.todoList.splice(index, 1);
	}

	onAddBoxFocus(event) {
		this.addElem.classList.add('active');
	}

	onBlur(event) {
		if (!this.options.allowAdding || this.options.customAddForm) {
			return;
		}
		if (event.target == this.addBox || event.target.closest('.add-item') == this.addElem) {
			this.addBox.focus();
		} else {
			this.addElem.classList.remove('active');
		}
		if (event.target != this.titleElement && this.titleText && this.options.titleEditable) {
			this.title = this.titleElement.innerHTML;
			console.log(this.title);
		}
	}

	onAddTodo(event) {
		event.preventDefault();

		let value = this.getInputValue(),
			item = null;

		if (value) {
			item = new TodoListItem(value, false, this.options.listItem, this.listElement);
			this.add(item);
			this.clearInput();
			this.addElem && this.addElem.classList.remove('active');
			item.textBox.focus();
		}

		this.options.onAddTodo && this.options.onAddTodo.call(this, item);
	}

	onClearList() {
		this.setList();
	}

	onRemoveList() {
		this.listElement.remove();
		this.titleElement.remove();
		this.toolsElement.remove();

		if (this.options.desk) {
			// dispatch event for handling by TodoListBuilder class
			var removeTodoList = new CustomEvent("removeTodoList", {
				bubbles: true,
				detail: {
					todoList: this
				}
			});
			this.options.desk.dispatchEvent(removeTodoList);
		}
	}

	getInputValue() {
		if (this.options.customAddForm) {
			return this.addInput.value;
		} else {
			return this.addBox.innerHTML;
		}
	}

	clearInput() {
		if (this.options.customAddForm) {
			this.addInput.value = '';
		} else {
			this.addBox.innerHTML = '';
		}
	}

}
