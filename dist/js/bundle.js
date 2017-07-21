/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/*
*    JavaScript Autocomplete
*    Author: Vladimir Chernov
*    For KeepSolid Summer Internship 2017
*/
/*jslint esversion: 6 */

const AutocompleteDefaults = {
    noSuggestionText: 'No matches',
    arrowNavigation: true,
    symbolsToStart: 1, // start matching from this symbols amount
    limit: 5, // 0 - all suggestions
    sort: 'ASC', // ASC || DESC
    onSelect: null, // callback function on item select
    errorClass: 'error', // sort order
    highliteMatchesClass: 'highlite' // span.highlite
};
/* unused harmony export AutocompleteDefaults */


class Autocomplete {

    constructor(input, data, options) {

        this.input = input;
        this.data = data;
        this.options = Object.assign({}, AutocompleteDefaults, options);
        this.resultData = [];

        this.init();
    }

    get isOpened() {
        return this._isOpened;
    }

    set isOpened(value) {
        this._isOpened = value;
        if(value) {
            this.ac.classList.add('active');
        } else {
            this.ac.classList.remove('active');
        }
    }

    init() {
        this.wrapElements();
        this.createButtons();
        this.createDialog();
        this.setData();
        this.initHandlers();
    }

    setData() {
        if(typeof this.data != 'string') {
            this.data = Object.values(this.data);
            this.sortData();
            this.resultData = this.data;
            this.setDialogList();
        } else if(typeof this.data == 'string') {
            this.getDataByURL(this.data);
        } else {
            console.error('There is no data to autocomplete.');
            return false;
        }
    }

    wrapElements() {
        // div.autocomplete to contain .form-group, .dialog and buttons
        this.ac = document.createElement('div');
        this.ac.classList.add('autocomplete');

        // div.form-control to contain input itself
        this.fc = this.input.parentNode;
        // this.fc = this.input.closest('.form-control');
        if (this.fc.classList.contains('form-control')) {
            this.fc = document.createElement('div');
            this.fc.classList.add('form-control');
            this.ac.appendChild(this.fc);
            this.input.parentNode.insertBefore(this.ac, this.input);
            let originInput = this.input.cloneNode(true);
            this.input.parentNode.removeChild(this.input);
            this.fc.appendChild(originInput);
            this.input = originInput;
        } else {
            this.fc.parentNode.insertBefore(this.ac, this.fc);
            let originFC = this.fc.cloneNode(true);
            let originInput = this.input.cloneNode(true);
            this.fc.parentNode.removeChild(this.fc);
            this.ac.appendChild(originFC);
            this.fc = originFC;
            this.input = originInput;
            this.fc.innerHTML = '';
            this.fc.appendChild(this.input);
        }
    }

    createButtons() {
        // create close button
        this.close = document.createElement('span');
        this.close.classList.add('close');
        this.fc.appendChild(this.close);
    }

    createDialog() {
        // create dialog to contain suggestions block with options and other
        this.suggestions = document.createElement('ul');
        this.suggestions.classList.add('suggestions');
        this.dialog = document.createElement('div');
        this.dialog.classList.add('dialog');

        this.dialog.appendChild(this.suggestions);
        this.ac.appendChild(this.dialog);

        this.isOpened = false;
    }

    getDataByURL(url) {
        fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(result){
                this.data = result;
                this.sortData();
                this.resultData = this.data;
                this.setDialogList();
            })
            .catch(console.log);
    }

    clearDialog() {
        this.suggestions.innerHTML = '';
        this.fc.classList.remove('error');
    }

    setDialogList() {
        this.clearDialog();

        let items = '';
        if (!this.resultData.length) {
            this.fc.classList.add(this.options.errorClass);
            this.showMessage(this.dialog, this.suggestions, this.options.noSuggestionText, 'error', 'noSuggestion');
        } else {
            this.removeMessage(this.dialog, 'error', 'noSuggestion');
            const hl = new RegExp(`<span.*?>(.+?)</span>`, 'gi');

            for (let i = 0; i < this.resultData.length; i++) {
                let value = this.resultData[i];
                let dataValue = value.replace(hl, '$1');

                items += `<li class="option" tabindex="${i + 1}" data-val="${dataValue}">${value}</li>`;
            }
        }

        this.suggestions.innerHTML = items;
    }

    showMessage(elem, elemBefore, msg, msgClass, type) {
        let prevMsg = elem.querySelector('.message.'+msgClass+'[data-type="'+type+'"]');
        if (prevMsg) {
            prevMsg.innerHTML = msg;
        } else {
            let message = document.createElement('span');
            message.classList.add('message');
            message.classList.add(msgClass);
            message.setAttribute('data-type', type);
            message.innerHTML = msg;
            elem.insertBefore(message, elemBefore);
        }
    }

    removeMessage(elem, msgClass, type) {
        let message = elem.querySelector('.message.'+msgClass+'[data-type="'+type+'"]');
        message && message.remove();
    }

    sortData() {
        switch (this.options.sort) {
            case 'ASC':
                this.data.sort();
                break;
            case 'DESC':
                this.data.sort().reverse();
                break;
        }
    }

    match(str) {
        this.resultData = [];

        const value = this.input.value;
        const regexp = new RegExp(`(${value})`, 'gi');

        let count = 0;
        let limit = this.options.limit || this.data.length;

        for(let i = 0; i < this.data.length && count < limit; i++) {
            let item = this.data[i];
            const matches = item.match(regexp);
            if (matches) {
                const string = item.replace(regexp, `<span class="${this.options.highliteMatchesClass}">$1</span>`);
                this.resultData[this.resultData.length] = string;
                count++;
            }
        }
        this.setDialogList();
    }

    selectOption(option) {
        let str = option.getAttribute('data-val');
        this.input.value = str;
        this.match(str);
        this.close.classList.add('visible');
        this.input.focus();

        str && this.options.onSelect && this.options.onSelect.call(this, str);
    }

    initHandlers() {
        this.input.addEventListener('focus', this.onInputFocus.bind(this));
        this.input.addEventListener('keyup', this.onInput.bind(this));
        this.close.addEventListener('click', this.onClose.bind(this));
        this.suggestions.addEventListener('click', this.onSuggestionsClick.bind(this));
        document.addEventListener('keyup', this.onKeyPress.bind(this));
        document.addEventListener('click', this.onOuterClick.bind(this));
    }

    onInputFocus() {
        this.isOpened = true;
    }

    onInput() {
        if(event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 13) {
            if (this.input.value.length >= this.options.symbolsToStart) {
                this.close.classList.add('visible');
                this.match(this.input.value);
            } else {
                this.close.classList.remove('visible');
                this.resultData = this.data;
                this.setDialogList();
            }
        }
    }

    onClose() {
        this.resultData = this.data;
        this.setDialogList();

        this.close.classList.remove('visible');
        // this.ac.classList.add('active');
        this.isOpened = true;

        this.input.value = '';
        this.input.focus();
    }

    onKeyPress(event) {
        switch (event.keyCode) {
            case 38: // if the UP key is pressed
                this.focusPrev(document.activeElement);
                break;
            case 40: // if the DOWN key is pressed
                this.focusNext(document.activeElement);
                break;
            case 13: // if the ENTER key is pressed
                if (this.suggestions.contains(document.activeElement)) {
                    this.selectOption(document.activeElement);
                }
                break;
        }
    }

    focusPrev(current) {
        if (current == this.input || current == this.suggestions.firstChild) { this.input.focus(); }
        else if (this.suggestions.contains(current)) {
            if (current.previousSibling.classList.contains('selected')) {
                this.focusPrev(current.previousSibling);
            } else {
                current.previousSibling.focus();
            }
        }
    }

    focusNext(current) {
        if (document.activeElement == this.input) {
            this.suggestions.querySelector('.option:not(.selected)').focus();
        }
        // else if (document.activeElement == this.suggestions.lastChild) { return; }
        else if (this.suggestions.contains(document.activeElement)) {
            if (current.nextSibling.classList.contains('selected')) {
                this.focusNext(current.nextSibling);
            } else {
                current.nextSibling.focus();
            }
        }
    }

    onOuterClick(event) {
        if (event.target !== this.input && event.target !== this.close && !this.suggestions.contains(event.target)) {
            this.isOpened = false;
        }
    }

    onSuggestionsClick(event) {
        if (this.suggestions.contains(event.target)) {
            this.selectOption(event.target);
        }
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Autocomplete;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__todoListItem_js__ = __webpack_require__(4);
/*
*    JavaScript Autocomplete
*    Author: Vladimir Chernov
*    For KeepSolid Summer Internship 2017
*/
/*jslint esversion: 6 */



const TodoListDefaults = {
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
/* unused harmony export TodoListDefaults */


const TEMPLATE = `
<div class="todolist">
	<div class="todolist--list"></div>
</div>
`;

class TodoList {

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
			let item = new __WEBPACK_IMPORTED_MODULE_0__todoListItem_js__["a" /* TodoListItem */](todo.text, todo.complete, this.options.listItem);
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
			item = new __WEBPACK_IMPORTED_MODULE_0__todoListItem_js__["a" /* TodoListItem */](value, false, this.options.listItem, this.listElement);
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
/* harmony export (immutable) */ __webpack_exports__["a"] = TodoList;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__autocomplete_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__chips_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__todoList_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__todoListBuilder_js__ = __webpack_require__(5);
/*jslint esversion: 6 */
/*jslint node: true */
/*global document, alert, fetch, Autocomplete, Chips, TodoList, countriesData, todoData*/







// TODO: add JS Doc

/* AUTOCOMPLETE */

let autocompleteInputs = document.querySelectorAll('.present-autocomplete');
autocompleteInputs = Array.prototype.slice.call(autocompleteInputs);

autocompleteInputs.forEach(curInput => {
    const dataSource = curInput.dataset.src;
    curInput.parentNode.classList.add('loading'); // preloader

    getAutocompleteData(dataSource, curInput).then((result) => {
        const data = Object.keys(result).map(key => result[key]);

        new __WEBPACK_IMPORTED_MODULE_0__autocomplete_js__["a" /* Autocomplete */](curInput, data, {
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

        new __WEBPACK_IMPORTED_MODULE_1__chips_js__["a" /* Chips */](curInput, data, {
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
    let defaultList = new __WEBPACK_IMPORTED_MODULE_2__todoList_js__["a" /* TodoList */](todos.querySelector('#todolist-default'), data, {
        customAdding: document.querySelector('.custom-form'),
        onAddTodo: onAddTodo,
        tools: false
    });
    let customList = new __WEBPACK_IMPORTED_MODULE_2__todoList_js__["a" /* TodoList */](todos.querySelector('#todolist-custom'), data, {
        titleText: 'Summer education'
    });
    let disabledList = new __WEBPACK_IMPORTED_MODULE_2__todoList_js__["a" /* TodoList */](todos.querySelector('#todolist-disabled'), data, {
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

    let desk = new __WEBPACK_IMPORTED_MODULE_3__todoListBuilder_js__["a" /* TodoListBuilder */](boardElement, {
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


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__autocomplete_js__ = __webpack_require__(0);
/*
*    JavaScript Autocomplete
*    Author: Vladimir Chernov
*    For KeepSolid Summer Internship 2017
*/
/*jslint esversion: 6 */



const ChipsDefaults = {
	maxChipsNumber: 4, // 0 - without limit
	maxChipsText: 'Maximum number of chips reached.',
	isSelectedText: 'This option is already selected.',
	selectOnlyOnce: true,
	removable: true,
	removeBtnText: '&times;',
	toggleOnSelect: false // override selectOnlyOnce (as false)
};
/* unused harmony export ChipsDefaults */


class Chips extends __WEBPACK_IMPORTED_MODULE_0__autocomplete_js__["a" /* Autocomplete */] {

	constructor(input, data, options) {

		super(input, data, options);
		this.options = Object.assign({}, ChipsDefaults, this.options);
		this.chips = []; // array of strings
		this.chipsList = []; // DOM element div.chips-list
		this.chipsElem; // DOM element div.autocomplete.chips

		this.setChipsList();
		this.markSelectedOptions();
	}

	setChipsList() {
		this.ac.classList.add('chips');
		this.chipsElem = this.ac;
		this.chipsList = document.createElement('div');
		this.chipsList.classList.add('chips-list');
		this.chipsElem.insertBefore(this.chipsList, this.fc);

		if (this.chips.length) { this.updateChipsList(); }

		this.chipsList.addEventListener('click', this.chipsClick.bind(this));
	}

	updateChipsList() {
		this.removeMessage(this.ac, 'error', 'isSelected');

		let removeBtn = this.options.removable ? ' <span class="remove">&times;</span>' : '';
		let classList = this.options.removable ? 'chip removable' : 'chip';

		let list = '';
		this.chips.forEach((chip) => {
			list += `<span class="${classList}" data-val="${chip}">${chip}${removeBtn}</span>`;
		});

		this.chipsList.innerHTML = list;
		this.markSelectedOptions();
		this.isMaxAmount();

		this.options.onSelect && this.options.onSelect.call(this, this.chips);
	}

	addChip(str) {
		this.chips[this.chips.length] = str;
		this.updateChipsList();
	}

	removeChip(str) {
		let chip = this.chipsList.querySelector('[data-val="'+str+'"]');

		for(let i = 0; i < this.chips.length; i++) {
			if (this.chips[i] === str) {
				this.chips.splice(i, 1);
				break;
			}
		}
		this.updateChipsList();
	}

	markSelectedOptions() {
		let options = this.suggestions.querySelectorAll('.option');
		options.forEach((option) => {
			let value = option.getAttribute('data-val');
			if (this.chips.includes(value)) {
				this.markOption(option);
			} else {
				this.unmarkOption(option);
			}
		});
	}

	markOption(option) {
		option.classList.add('selected');
		option.removeAttribute('tabindex');
	}

	unmarkOption(option) {
		option.classList.remove('selected');
		let index = this.resultData.indexOf(option.getAttribute('data-val'));
		option.setAttribute('tabindex', index);
	}

	toggleMarking(option) {
		if (option.classList.contains('selected')) {
			this.unmarkOption(option);
		} else {
			this.markOption(option);
		}
	}

	isMaxAmount() {
		if (this.options.maxChipsNumber && this.chips.length >= this.options.maxChipsNumber) {
			this.showMessage(this.ac, this.chipsList, this.options.maxChipsText, 'error', 'maxChipsNumber');
			return true;
		} else {
			this.removeMessage(this.ac, 'error', 'maxChipsNumber');
			return false;
		}
	}

	selectOption(option) {
		let str = option.getAttribute('data-val');

		if (!this.isMaxAmount() && this.isAvailable(str)) {
			this.addChip(str);
		}
		this.markSelectedOptions();
    }

	toggleOption(option) {
		let str = option.getAttribute('data-val');

		if (!this.isMaxAmount() && this.isAvailable(str)) {
			this.addChip(str);
		} else {
			this.removeChip(str);
		}

		this.markSelectedOptions();
	}

	isAvailable(str) {
		if (this.isSelected(str) && this.options.selectOnlyOnce) {
			this.showMessage(this.ac, this.chipsList, this.options.isSelectedText, 'error', 'isSelected');
			return false;
		}
		return true;
	}

	isSelected(str) {
		return this.chips.includes(str) ? true : false;
	}

	chipsClick(event) {
		if (event.target.classList.contains('remove')) {
			let value = event.target.parentNode.getAttribute('data-val');
			this.removeChip(value);
		}
	}

	onInput() {
		super.onInput();
		this.markSelectedOptions();
	}

	onClose() {
		super.onClose();
		this.markSelectedOptions();
	}

	onSuggestionsClick(event) {
		this.removeMessage(this.ac, 'error', 'isSelected');

		if (this.suggestions.contains(event.target) && !this.options.toggleOnSelect) {
			this.selectOption(event.target);
		} else if (this.suggestions.contains(event.target) && this.options.toggleOnSelect) {
			this.toggleOption(event.target);
		}

		this.isMaxAmount();
		this.input.focus();
	}

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Chips;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/*
*    JavaScript Autocomplete
*    Author: Vladimir Chernov
*    For KeepSolid Summer Internship 2017
*/
/*jslint esversion: 6 */

const TodoListItemDefaults = {
	editable: true,
	removable: true,
	singleLine: true,
	removeBtnText: '<span class="fa fa-times-circle"></span>',
	parentList: null
};
/* unused harmony export TodoListItemDefaults */


class TodoListItem {

	constructor(text, complete, options) {

		this.parentList = options.parentList;
		this.options = Object.assign({}, TodoListItemDefaults, options);

		this.createElem();
		this.initHandlers();

		this.text = text;
		this.complete = complete;
	}

	get text() {
		return this._text;
	}

	set text(value) {
		this._text = value;
		this.textBox.innerHTML = value;
	}

	get complete() {
		return this._complete;
	}

	set complete(value) {
		this._complete = value;

		if (value) {
			this.elem.classList.add('complete');
			this.checkbox.checked = true;
		} else {
			this.elem.classList.remove('complete');
			this.checkbox.checked = false;
		}
	}

	createElem() {
		this.elem = document.createElement('li');
		this.elem.classList.add('todolist-item');

		this.createCheckBox();
		this.createTextBox();

		this.options.editable && this.elem.classList.add('editable');
		this.textBox.setAttribute('contenteditable', this.options.editable);

		this.options.removable && this.createRemoveBtn();
	}

	createCheckBox() {
		this.checkbox = document.createElement('input');
		this.checkbox.type = 'checkbox';
		this.checkboxLabel = document.createElement('label')
		this.checkboxLabel.classList.add('todolist-item--complete');
		this.checkboxLabel.appendChild(this.checkbox);
		this.elem.appendChild(this.checkboxLabel);
	}

	createRemoveBtn() {
		this.removeBtn = document.createElement('div');
		this.removeBtn.classList.add('todolist-item--remove');
		this.removeBtn.innerHTML = this.options.removeBtnText;
		this.elem.appendChild(this.removeBtn);
	}

	createTextBox() {
		this.textBox = document.createElement('div');
		this.textBox.classList.add('todolist-item--text');
		this.options.singleLine && this.textBox.classList.add('single-line');
		this.elem.appendChild(this.textBox);
	}

	initHandlers() {
		this.checkboxLabel.addEventListener('click', this.toggleComplete.bind(this));
		document.addEventListener('click', this.onBlur.bind(this));

		if (this.options.editable) {
			this.textBox.addEventListener('focus', this.onEdit.bind(this));
		}
		if (this.options.removable) {
			this.removeBtn.addEventListener('click', this.onRemove.bind(this));
		}
	}

	toggleComplete() {
		this.complete = !this.complete;
	}

	onRemove() {
		this.elem.remove();

		// dispatch event for handling by TodoList class
		var removeTodo = new CustomEvent("todoListItem.remove", {
			bubbles: true,
			detail: {
				item: this
			}
		});
		this.parentList.dispatchEvent(removeTodo);
	}

	onEdit() {
		this.textBox.classList.remove('single-line');
		// this.placeCaretAtEnd();
		this.elem.classList.add('active');
	}

	onBlur() {
		if (event.target != this.textBox) {
			this.elem.classList.remove('active');
			// this.textBox.innerHTML = this.text;

			if (this.textBox.innerHTML) {
				this.text = this.textBox.innerHTML;
			} else {
				this.textBox.innerHTML = this.text;
			}

			if (this.options.singleLine) {
				this.textBox.classList.add('single-line');
			}
		}
	}

	placeCaretAtEnd() {
		var range,selection;
		range = document.createRange();//Create a range (a range is a like the selection but invisible)
		range.selectNodeContents(this.textBox);//Select the entire contents of the element with the range
		range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
		selection = window.getSelection();//get the selection object (allows you to change selection)
		selection.removeAllRanges();//remove any selections already made
		selection.addRange(range);//make the range you have just created the visible selection
	}

}
/* harmony export (immutable) */ __webpack_exports__["a"] = TodoListItem;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__todoList_js__ = __webpack_require__(1);
/*
*    JavaScript TodoListBuilder
*    Author: Vladimir Chernov
*    For KeepSolid Summer Internship 2017
*/
/*jslint esversion: 6 */



const TodoListBuilderDefaults = {
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
/* unused harmony export TodoListBuilderDefaults */


class TodoListBuilder {

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

		newList.item = new __WEBPACK_IMPORTED_MODULE_0__todoList_js__["a" /* TodoList */](outerDeepest, todoList.data, newListOptions);
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
/* harmony export (immutable) */ __webpack_exports__["a"] = TodoListBuilder;



/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map