/*
*    JavaScript Autocomplete
*    Author: Vladimir Chernov
*    For KeepSolid Summer Internship 2017
*/
/*jslint esversion: 6 */

import { TodoListItem, TodoListItemDefaults } from "./todoListItem.js";

export const TodoListDefaults = {
	enableAdding: true,
	// addIconText: '<span class="fa fa-plus-circle"></span>',
	// addBoxPlaceholder: 'New todo:',
	// customAddForm: null, // DOM Element. Will disable creating adding-item if set
	customAdding: null, // DOM Element form
	iconText: '<span class="fa fa-plus-circle"></span>',
	placeholder: 'New todo:',
	titleText: null,
	titleElement: 'h5',
	titleEditable: true,
	tools: true,
	removeToolText: '<span class="fa fa-trash"></span>',
	clearToolText: '<span class="fa fa-times-circle"></span>',
	readonly: false,
	board: null, // DOM Element of main builder element for events assign
	listItem: {} // extends todoListItem default options
};

const TEMPLATE = `
<div class="todolist">
	<div class="todolist--list"></div>
</div>
`;

export class TodoList {

	constructor(listParentElement, data, options) {
		this.options = Object.assign({}, TodoListDefaults, options);
		this.options.listItem = Object.assign({}, options.listItem);

		if (this.options.readonly) {
			this.options.enableAdding = false;
			this.options.tools = false;
			this.options.listItem.editable = false;
			this.options.listItem.removable = false;
		}

		this.data = data || [];
		this.todoList = []; // contains objects of TodoListItem

		this.loadTemplate(listParentElement);
		this.setList(this.data);
		this.initHandlers();
	}

	get title() {
		return this._title;
	}

	set title(value) {
		this._title = value;
		this.titleElement.innerHTML = value;
	}

	loadTemplate(listParentElement) {
		listParentElement.innerHTML = TEMPLATE;
		this.listElement = listParentElement.querySelector('.todolist--list');
		this.options.listItem.parentList = this.listElement;

		this.options.titleText && this.createTitle();
		this.options.tools && this.createTools();
		this.options.enableAdding && this.setAddingForm();
	}

	createTitle() {
		this.titleElement = document.createElement(this.options.titleElement);
		this.titleElement.classList.add('todolist--title');
		this.titleElement.setAttribute('contenteditable', this.options.titleEditable);
		this.listElement.parentElement.insertBefore(this.titleElement, this.listElement);
		this.title = this.options.titleText;
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

	setAddingForm() {
		if (this.options.customAdding) {
			// set from options if is set
			this.addForm = this.options.customAdding;
			this.addInput = this.addForm.querySelector('input');
			this.addForm.addEventListener('submit', this.onAddTodo.bind(this));
		} else {
			this.createAddingItem();
			this.addBox.addEventListener('focus', this.onAddBoxFocus.bind(this));
			this.addBox.addEventListener('input', this.onAddTodo.bind(this));
		}
	}

	createAddingItem() {
		let inner = `
		<div class="todolist-item--add-icon">${this.options.iconText}</div>
		<div class="todolist-item--text single-line">
            <div class="placeholder">${this.options.placeholder}</div>
            <div class="adding-box" contenteditable="true"></div>
        </div>`;

		this.addElem = document.createElement('li');
		this.addElem.classList.add('todolist-item', 'add-item', 'editable');
		this.listElement.appendChild(this.addElem);

		this.addElem.innerHTML = inner;
		this.addBox = this.addElem.querySelector('.adding-box');
	}

	setList(data) {
		data = data || [];
		this.todoList = [];
		this.listElement.innerHTML = '';
		this.addElem && this.listElement.appendChild(this.addElem);
		data.forEach((todo) => {
			let item = new TodoListItem(todo.text, todo.complete, this.options.listItem);
			this.add(item);
		});
	}

	add(item) {
		if (this.addElem) {
			this.listElement.insertBefore(item.elem, this.addElem);
		} else {
			this.listElement.appendChild(item.elem);
		}

		this.todoList.push(item);
	}

	initHandlers() {
		this.listElement.addEventListener('todoListItem.remove', this.onRemoveTodo.bind(this));
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
		if (this.addElem) {
			if (event.target == this.addBox || event.target.closest('.add-item') == this.addElem) {
				this.addBox.focus();
			} else {
				this.addElem.classList.remove('active');
			}
		}
		if (this.title && this.options.titleEditable && event.target != this.titleElement) {
			this.title = this.titleElement.innerHTML;
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

		if (this.options.board) {
			// dispatch event for handling by TodoListBuilder class
			var removeTodoList = new CustomEvent("todoList.remove", {
				bubbles: true,
				detail: {
					todoList: this
				}
			});
			this.options.board.dispatchEvent(removeTodoList);
		}
	}

	getInputValue() {
		if (this.options.customAdding) {
			return this.addInput.value;
		} else {
			return this.addBox.innerHTML;
		}
	}

	clearInput() {
		if (this.options.customAdding) {
			this.addInput.value = '';
		} else {
			this.addBox.innerHTML = '';
		}
	}

}
