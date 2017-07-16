/*jslint esversion: 6 */
/*jslint node: true */
/*global document, alert, fetch, Autocomplete, Chips, ToDoList, countriesData, todoData*/

'use strict';
import { Autocomplete, AutocompleteDefaults } from "./autocomplete.js";
import { Chips, ChipsDefaults } from "./chips.js";
import { ToDoListItem } from "./todoListItem.js";
import { ToDoList, ToDoListDefaults } from "./todoList.js";

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

let todos = document.querySelector('.presentation#todolist');

getToDoData('todo').then((data) => {
    let defaultList = new ToDoList(todos.querySelector('#todolist-default'), data);
    let customList = new ToDoList(todos.querySelector('#todolist-custom'), data, {
        addInputPlaceholder: 'What we must learn?',
        addForm: {
            form: document.querySelector('.custom-form'),
            input: document.querySelector('.custom-form input'),
            submitBtn: document.querySelector('.custom-form .btn'),
        },
        removeBtnText: '<div class="remove">&times;</div>',
        onAdd: (status) => {
            customList.addForm.submitBtn.classList.remove('success', 'error');
            if (status) {
                customList.addForm.submitBtn.classList.add('success');
            } else {
                customList.addForm.submitBtn.classList.add('error');
            }
            setTimeout(function () {
                customList.addForm.submitBtn.classList.remove('success', 'error');
            }, 2000);
        }
    });
    let disabledList = new ToDoList(todos.querySelector('#todolist-disabled'), data, {
        allowAdding: false,
        editable: false,
        removable: false
    });
});

/* FUNCTIONS */

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
