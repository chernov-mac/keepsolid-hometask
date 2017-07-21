/*jslint esversion: 6 */
/*jslint node: true */
/*global document, alert, fetch, Autocomplete, Chips, TodoList, countriesData, todoData*/

'use strict';
import { Autocomplete } from "./autocomplete.js";
import { Chips } from "./chips.js";
import { TodoList } from "./todoList.js";
import { TodoListBuilder } from "./todoListBuilder.js";

// TODO: add JS Doc

/* AUTOCOMPLETE */

let autocompleteInputs = document.querySelectorAll('.present-autocomplete');
autocompleteInputs = Array.prototype.slice.call(autocompleteInputs);

autocompleteInputs.forEach(curInput => {
    const dataSource = curInput.dataset.src;
    curInput.parentNode.classList.add('loading'); // preloader

    getAutocompleteData(dataSource, curInput).then((result) => {
        const data = Object.keys(result).map(key => result[key]);

        new Autocomplete(curInput, data, {
            onSelect: (value) => {
                curInput.value = value;
                alert(value);
            }
        });
    });
});

/* CHIPS */

let chipsInputs = document.querySelectorAll('.present-chips');
chipsInputs = Array.prototype.slice.call(chipsInputs);

chipsInputs.forEach(curInput => {
    const dataSource = curInput.dataset.src;
    curInput.parentNode.classList.add('loading'); // preloader

    getAutocompleteData(dataSource, curInput).then((result) => {
        const data = Object.keys(result).map(key => result[key]);

        new Chips(curInput, data, {
            onSelect: (result) => {
                let str = '<span>' + result.join('</span>, <span>') + '</span>';
                document.querySelector('.result[data-for="#'+curInput.getAttribute('id')+'"]').innerHTML = str;
            }
        });
    });
});

/* TODOLIST */

var todos = document.querySelector('.presentation#todolist');

getToDoData('todo').then((data) => {
    let defaultList = new TodoList(todos.querySelector('#todolist-default'), data, {
        customAdding: document.querySelector('.custom-form'),
        onAddTodo: onAddTodo,
        tools: false
    });
    let customList = new TodoList(todos.querySelector('#todolist-custom'), data, {
        titleText: 'Summer education'
    });
    let disabledList = new TodoList(todos.querySelector('#todolist-disabled'), data, {
        readonly: true
    });
});

/* TODOLIST BUILDER */

getToDoData('todo').then((data) => {
    let boardElement = document.querySelector('#todo-board');
    let existingTodoLists = [];

    existingTodoLists.push({
        title: 'Summer education',
        data: data
    });
    existingTodoLists.push({
        title: 'Other education',
        data: data
    });
    existingTodoLists.push({
        data: data
    });

    let desk = new TodoListBuilder(boardElement, {
        existingTodoLists: existingTodoLists,
        boardClasses: 'row-24',
        builderFormOuterClasses: 'row-24>.col.xxs-24.md-12.lg-10.offset-md-6.offset-lg-7.custom-form',
        builderFormClasses: 'custom-form',
    	builderInputOuterClasses: 'form-control',
    	builderButtonClasses: 'btn btn-add btn-icon blue',
        todoListOuterClasses: '.col.xxs-24.md-12.lg-8>.card.todolist',
    	builderButtonText: '<span class="text">Add TodoList</span><span class="icon"><span class="fa fa-plus"></span></span>',
        todoList: {
            titleText: 'New List',
            listItem: {
                // editable: false
            }
        }
    });
});

/* FUNCTIONS */

function onAddTodo(item) {
    let btn = document.querySelector('.custom-form .btn-icon');
    btn.classList.remove('success', 'error');
    if (item) {
        btn.classList.add('success');
        console.log('Item with text \'' + item.text + '\' created successfully! Default complete status is: ' + item.complete + '\'.');
    } else {
        btn.classList.add('error');
        console.log('Cannot create item with text \'' + document.querySelector('.custom-form input').value + '\'.');
    }
    setTimeout(function () {
        btn.classList.remove('success', 'error');
    }, 2000);
}

function getAutocompleteData(dataString, curInput) {
    switch (dataString) {
        case 'countries-cors':
            return fetch('https://crossorigin.me/http://country.io/names.json', {
                mode: 'cors',
            }).then(function(result){
                curInput.parentNode.classList.remove('loading');
                return result.json();
            });
        default:
            curInput.parentNode.classList.remove('loading');
            return new Promise((resolve, reject) => {
                resolve(countriesData);
            });
    }
}

function getToDoData(dataString, todolist) {
    return new Promise((resolve, reject) => {
        resolve(todoData);
    });
}
