/*
*    JavaScript TodoListBuilder
*    Author: Vladimir Chernov
*    For KeepSolid Summer Internship 2017
*/
/*jslint esversion: 6 */

import { TodoList, TodoListDefaults } from "./todoList.js";

export const TodoListBuilderDefaults = {
	outerClasses: null, // string of classes, e.g. '.my.outer>.nested'
	creator: null, // DOM Element that will add new empty list
	defaultTitle: 'New TodoList' // override TodoList.options.title
};

export class TodoListBuilder {

	constructor(desk, options) {

		this.options = Object.assign({}, TodoListBuilderDefaults, options);
		this.desk = desk;
		this.lists = [];

		this.init();
		this.initEvents();

	}

	init() {
		if (this.options.existingTodoLists) {
			this.options.existingTodoLists.forEach(todoList => {
				this.addList(todoList);
			});
		}
	}

	addList(todoList) {
		todoList = todoList || {};
		let outer = this.createOuter();
		let outerDeepest = outer.querySelector('.outer-deepest');

		outerDeepest.classList.remove('outer-deepest');
		this.desk.appendChild(outer);

		let newList = {};
		newList.item = new TodoList(outerDeepest, todoList.data, {
			title: todoList.title || this.options.defaultTitle,
			tools: true,
			desk: this.desk
		});
		newList.outer = outer;
		this.lists.push(newList);
	}

	createOuter() {
		let outerElementsArray = this.options.outerClasses.split('>'),
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
		if (this.options.creator) {
			this.options.creator.addEventListener('click', this.onCreateNew.bind(this));
		}
		this.desk.addEventListener('removeTodoList', this.onRemoveTodoList.bind(this));
	}

	onCreateNew() {
		this.addList();
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
