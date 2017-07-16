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
/*
*    JavaScript Autocomplete
*    Author: Vladimir Chernov
*    For KeepSolid Summer Internship 2017
*/
/*jslint esversion: 6 */

class ToDoListItem {

	constructor(text, complete, options) {

		this.options = options;

		this.elem = document.createElement('li');
		this.elem.classList.add('todolist-item');
		if (this.options.editable) { this.elem.classList.add('editable'); }

		this.createButtons();
		this.createTextBox();
		this.initHandlers();

		this.text = text;
		this.complete = complete;
	}

	get text() {
		return this._text;
	}

	set text(value) {
		this._text = value;
		this.textValueBox.innerHTML = value;
		this.input.value = value;
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

	createButtons() {
		this.removeBtn = document.createElement('div');
		this.removeBtn.classList.add('todolist-item--remove');
		this.removeBtn.innerHTML = this.options.removeBtnText;

		this.checkbox = document.createElement('input');
		this.checkbox.type = 'checkbox';

		this.checkboxLabel = document.createElement('label')
		this.checkboxLabel.classList.add('todolist-item--complete');
		this.checkboxLabel.appendChild(this.checkbox);

		this.elem.appendChild(this.checkboxLabel);

		if (this.options.removable) {
			this.elem.appendChild(this.removeBtn);
		}
	}

	createTextBox() {
		this.textValueBox = document.createElement('div');
		this.textValueBox.classList.add('value');

		this.textBox = document.createElement('div');
		this.textBox.classList.add('todolist-item--text');
		this.textBox.appendChild(this.textValueBox);

		this.input = document.createElement('input');
		this.input.type = 'text';

		this.editValueBox = document.createElement('div');
		this.editValueBox.classList.add('form-control');
		this.editValueBox.classList.add('edit-value');
		this.editValueBox.appendChild(this.input);

		this.elem.appendChild(this.textBox);

		if (this.options.editable) {
			this.textBox.appendChild(this.editValueBox);
		}
	}

	initHandlers() {
		this.checkboxLabel.addEventListener('click', this.toggleComplete.bind(this));
		document.addEventListener('click', this.onBlur.bind(this));

		if (this.options.editable) {
			this.textBox.addEventListener('click', this.onEdit.bind(this));
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
	}

	onEdit() {
		this.elem.classList.add('active');
		this.input.focus();
	}

	onBlur() {
		if (event.target != this.textBox && event.target != this.textValueBox && event.target != this.input) {
			this.elem.classList.remove('active');

			if (this.input.value) {
				this.text = this.input.value;
			} else {
				this.input.value = this.text;
			}
		}
	}

}
/* harmony export (immutable) */ __webpack_exports__["a"] = ToDoListItem;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__autocomplete_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__chips_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__todoListItem_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__todoList_js__ = __webpack_require__(4);
/*jslint esversion: 6 */
/*jslint node: true */
/*global document, alert, fetch, Autocomplete, Chips, ToDoList, countriesData, todoData*/







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

let todos = document.querySelector('.presentation#todolist');

getToDoData('todo').then((data) => {
    let defaultList = new __WEBPACK_IMPORTED_MODULE_3__todoList_js__["a" /* ToDoList */](todos.querySelector('#todolist-default'), data);
    let customList = new __WEBPACK_IMPORTED_MODULE_3__todoList_js__["a" /* ToDoList */](todos.querySelector('#todolist-custom'), data, {
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
    let disabledList = new __WEBPACK_IMPORTED_MODULE_3__todoList_js__["a" /* ToDoList */](todos.querySelector('#todolist-disabled'), data, {
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__todoListItem_js__ = __webpack_require__(1);
/*
*    JavaScript Autocomplete
*    Author: Vladimir Chernov
*    For KeepSolid Summer Internship 2017
*/
/*jslint esversion: 6 */



const ToDoListDefault = {
	editable: true,
	removable: true,
	removeBtnText: '&times;',
	allowAdding: true,
	addInputPlaceholder: 'To do:',
	/* by default if addForm is not set new form will be automatically created
	* and added into listElement.parentNode before listElement */
	addForm: {
		form: '', // DOM Element
		input: '', // DOM Element
		submitBtn: '' // DOM Element
	}
};
/* unused harmony export ToDoListDefault */


class ToDoList {

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
			let item = new __WEBPACK_IMPORTED_MODULE_0__todoListItem_js__["a" /* ToDoListItem */](todo.text, todo.complete, this.options);
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
			this.addForm.form.addEventListener('submit', this.checkValue.bind(this));
		}
		this.todoList.forEach(item => {
			if (this.options.removable) {
				item.removeBtn.addEventListener('click', this.removeTodo.bind(this, item));
			}
		});
	}

	removeTodo(item) {
		let index = this.todoList.indexOf(item);
		this.todoList.splice(index, 1);
	}

	add(item) {
		this.listElement.appendChild(item.elem);
		this.todoList.push(item);
	}

	checkValue(event) {
		event.preventDefault();

		let value = this.addForm.input.value;
		if (value) {
			let item = new __WEBPACK_IMPORTED_MODULE_0__todoListItem_js__["a" /* ToDoListItem */](this.addForm.input.value, false, this.options);
			this.add(item);
			this.options.onAdd && this.options.onAdd.call(this, true);
		} else {
			this.options.onAdd && this.options.onAdd.call(this, false);
		}

		this.addForm.input.value = '';
	}

}
/* harmony export (immutable) */ __webpack_exports__["a"] = ToDoList;



/***/ })
/******/ ]);