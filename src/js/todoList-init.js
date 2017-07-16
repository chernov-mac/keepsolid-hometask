/*jslint esversion: 6 */
/*jslint node: true */
/*global document, alert, fetch, todoData, ToDoList*/

'use strict';

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

function getToDoData(dataString, todolist) {
    return new Promise((resolve, reject) => {
        resolve(todoData);
    });
}
