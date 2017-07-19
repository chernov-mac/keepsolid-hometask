/*jslint esversion: 6 */
/*jslint node: true */
/*global document, alert, fetch, Autocomplete, Chips, TodoList, countriesData, todoData*/

'use strict';
import { Autocomplete, AutocompleteDefaults } from "./autocomplete.js";
import { Chips, ChipsDefaults } from "./chips.js";
import { TodoListItem } from "./todoListItem.js";
import { TodoList, TodoListDefaults } from "./todoList.js";
import { TodoListBuilder, TodoListBuilderDefaults } from "./todoListBuilder.js";

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
        customAddForm: document.querySelector('.custom-form'),
        addInputPlaceholder: 'What we must learn?',
        onAddTodo: onAddTodo
    });
    let customList = new TodoList(todos.querySelector('#todolist-custom'), data, {
        removeBtnText: '<div class="remove">&times;</div>',
        addIconText: '<span class="fa fa-plus-circle"></span>',
        title: 'Summer education',
        tools: true
    });
    let disabledList = new TodoList(todos.querySelector('#todolist-disabled'), data, {
        allowAdding: false,
        editable: false,
        removable: false
    });
});

/* TODOLIST BUILDER */

getToDoData('todo').then((data) => {
    let deskElement = document.querySelector('#todo-desk');
    let existingTodoLists = [];

    existingTodoLists.push({
        title: 'Summer education',
        data: data
    });
    existingTodoLists.push({
        data: data
    });

    let desk = new TodoListBuilder(deskElement, {
        existingTodoLists: existingTodoLists,
        outerClasses: '.col.xxs-24.md-12.lg-8>.card.todolist',
        creator: document.querySelector('#todolist-builder .btn-add')
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
