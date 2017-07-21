/*
*    JavaScript TodoListBuilder
*    Author: Vladimir Chernov
*    For KeepSolid Summer Internship 2017
*/
/*jslint esversion: 6 */

import { TodoList, TodoListDefaults } from "./todoList.js";

export const TodoListBuilderDefaults = {
	// builder: {
	// 	form: null, // DOM Element form, must be submitted to add new list
	// 	input: null // DOM Element input, unnecessary option
	// },
	enableAdding: true,
	boardClasses: null,
	todoListOuterClasses: null,
	builderFormOuterClasses: null,
	builderInputOuterClasses: null,
	builderButtonText: 'Add TodoList',
	builderPlaceholder: 'New TodoList',
	builderButtonClasses: '', // string of classes, e.g. '.my.outer>.nested'
	todoList: {} // extends todoList default options
};

export class TodoListBuilder {

	constructor(builderParentElement, options) {

		this.options = Object.assign({}, TodoListBuilderDefaults, options);
		this.options.todolist = Object.assign({}, options.todoList);

		this.lists = [];

		this.loadTemplate(builderParentElement);
		this.init();
		this.initEvents();

	}

	loadTemplate(builderParentElement) {
		let template = `
		<div class="todolist-builder">
			<div class="todolist-board ${this.options.boardClasses}"></div>
		</div>
		`;
		builderParentElement.innerHTML = template;
		this.board = builderParentElement.querySelector('.todolist-board');

		this.todoListOuterTemplate = this.createOuter(this.options.todoListOuterClasses);

		this.options.enableAdding && this.createBuilderForm();
	}

	createBuilderForm() {
		this.builder = {};
		this.builder.form = document.createElement('form');
		this.builder.form.className = this.options.builderFormClasses;
		this.builder.input = document.createElement('input');
		this.builder.input.type = 'text';
		this.builder.input.placeholder = this.options.builderPlaceholder;
		this.builder.button = document.createElement('button');
		this.builder.button.type = 'submit';
		this.builder.button.className = this.options.builderButtonClasses;
		this.builder.button.innerHTML = this.options.builderButtonText;

		let builderOuter = this.createOuter(this.options.builderFormOuterClasses);
		let builderOuterDeepest = builderOuter.querySelector('.outer-deepest') || builderOuter;

		let inputOuter = this.createOuter(this.options.builderInputOuterClasses);
		let inputOuterDeepest = inputOuter.querySelector('.outer-deepest') || inputOuter;

		builderOuterDeepest.appendChild(this.builder.form);
		builderOuterDeepest.classList.remove('outer-deepest');
		inputOuterDeepest.appendChild(this.builder.input);
		inputOuterDeepest.classList.remove('outer-deepest');

		this.builder.form.appendChild(inputOuter);
		this.builder.form.appendChild(this.builder.button);
		this.board.parentElement.insertBefore(builderOuter, this.board);
	}

	init() {
		if (this.options.existingTodoLists) {
			this.options.existingTodoLists.forEach(todoList => {
				this.buildList(todoList);
			});
		}
	}

	buildList(todoList) {
		todoList = todoList || {};
		let outer = this.todoListOuterTemplate.cloneNode(true);
		let outerDeepest = outer.querySelector('.outer-deepest') || outer;

		outerDeepest.classList.remove('outer-deepest');
		this.board.appendChild(outer);

		let newList = {};
		let newListOptions = {
			titleText: todoList.title || this.options.todoList.titleText,
			board: this.board
		};
		newListOptions = Object.assign({}, this.options.todoList, newListOptions);

		newList.item = new TodoList(outerDeepest, todoList.data, newListOptions);
		newList.outer = outer;
		this.lists.push(newList);
	}

	createOuter(outerClassesString) {
		let outerElementsArray = outerClassesString.split('>'),
			last = outerElementsArray.length - 1,
			i = 0,
			str = '';
		outerElementsArray.forEach(outerElementsClasses => {
			if (i == last) {
				outerElementsClasses += '.outer-deepest';
			}

			str += '<div class="';
			let elementClassArray = outerElementsClasses.split('.');

			elementClassArray.forEach(className => {
				str += className + ' ';
			});

			str += '">';
			i++;
		});
		outerElementsArray.forEach(() => {
			str += '</div>';
		});

		let temp = document.createElement('div');
		temp.innerHTML = str;
		let outer = temp.childNodes[0];

		return outer;
	}

	initEvents() {
		if (this.builder.form) {
			this.builder.form.addEventListener('submit', this.onCreateNew.bind(this));
		}
		this.board.addEventListener('todoList.remove', this.onRemoveTodoList.bind(this));
	}

	onCreateNew(event) {
		event.preventDefault();
		this.buildList({
			title: this.builder.input && this.builder.input.value
		});
		this.builder.input.value = '';
	}

	onRemoveTodoList(event) {
		let list = event.detail.todoList;
		let index = this.lists.indexOf(list);
		let i = 0;
		for (i = 0; i < this.lists.length; i++) {
			if (this.lists[i].item == list) break;
		}
		this.lists[i].outer.remove();
		this.lists.splice(i, 1);
	}

}
