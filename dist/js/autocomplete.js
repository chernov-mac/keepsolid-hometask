'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
*    JavaScript Autocomplete
*    Author: Vladimir Chernov
*    For KeepSolid Summer Internship 2017
*/
/*jslint esversion: 6 */

var AutocompleteDefaults = {
    noSuggestionText: 'No matches',
    arrowNavigation: true,
    symbolsToStart: 1, // start matching from this symbols amount
    limit: 5, // 0 - all suggestions
    sort: 'ASC', // ASC || DESC
    onSelect: null, // callback function on item select
    errorClass: 'error', // sort order
    highliteMatchesClass: 'highlite' // span.highlite
};

var Autocomplete = exports.Autocomplete = function () {
    function Autocomplete(input, data, options) {
        _classCallCheck(this, Autocomplete);

        this.input = input;
        this.data = data;
        this.options = Object.assign({}, AutocompleteDefaults, options);
        this.resultData = [];

        this.init();
    }

    _createClass(Autocomplete, [{
        key: 'init',
        value: function init() {
            this.wrapElements();
            this.createButtons();
            this.createDialog();
            this.setData();
            this.initHandlers();
        }
    }, {
        key: 'setData',
        value: function setData() {
            if (typeof this.data != 'string') {
                this.data = Object.values(this.data);
                this.sortData();
                this.resultData = this.data;
                this.setDialogList();
            } else if (typeof this.data == 'string') {
                this.getDataByURL(this.data);
            } else {
                console.error('There is no data to autocomplete.');
                return false;
            }
        }
    }, {
        key: 'wrapElements',
        value: function wrapElements() {
            // div.autocomplete to contain .form-group, .dialog and buttons
            this.ac = document.createElement('div');
            this.ac.classList.add('autocomplete');

            // div.form-control to contain input itself
            this.fc = this.input.closest('.form-control');
            if (!this.fc) {
                this.fc = document.createElement('div');
                this.fc.classList.add('form-control');
                this.ac.appendChild(this.fc);
                this.input.parentNode.insertBefore(this.ac, this.input);
                var originInput = this.input.cloneNode(true);
                this.input.parentNode.removeChild(this.input);
                this.fc.appendChild(originInput);
                this.input = originInput;
            } else {
                this.fc.parentNode.insertBefore(this.ac, this.fc);
                var originFC = this.fc.cloneNode(true);
                var _originInput = this.input.cloneNode(true);
                this.fc.parentNode.removeChild(this.fc);
                this.ac.appendChild(originFC);
                this.fc = originFC;
                this.input = _originInput;
                this.fc.innerHTML = '';
                this.fc.appendChild(this.input);
            }
        }
    }, {
        key: 'createButtons',
        value: function createButtons() {
            // create close button
            this.close = document.createElement('span');
            this.close.classList.add('close');
            this.fc.appendChild(this.close);
        }
    }, {
        key: 'createDialog',
        value: function createDialog() {
            // create dialog to contain suggestions block with options and other
            this.suggestions = document.createElement('ul');
            this.suggestions.classList.add('suggestions');
            this.dialog = document.createElement('div');
            this.dialog.classList.add('dialog');

            this.dialog.appendChild(this.suggestions);
            this.ac.appendChild(this.dialog);

            this.isOpened = false;
        }
    }, {
        key: 'getDataByURL',
        value: function getDataByURL(url) {
            fetch(url).then(function (response) {
                return response.json();
            }).then(function (result) {
                this.data = result;
                this.sortData();
                this.resultData = this.data;
                this.setDialogList();
            }).catch(console.log);
        }
    }, {
        key: 'clearDialog',
        value: function clearDialog() {
            this.suggestions.innerHTML = '';
            this.fc.classList.remove('error');
        }
    }, {
        key: 'setDialogList',
        value: function setDialogList() {
            this.clearDialog();

            var items = '';
            if (!this.resultData.length) {
                this.fc.classList.add(this.options.errorClass);
                this.showMessage(this.dialog, this.suggestions, this.options.noSuggestionText, 'error', 'noSuggestion');
            } else {
                this.removeMessage(this.dialog, 'error', 'noSuggestion');
                var hl = new RegExp('<span.*?>(.+?)</span>', 'gi');

                for (var i = 0; i < this.resultData.length; i++) {
                    var value = this.resultData[i];
                    var dataValue = value.replace(hl, '$1');

                    items += '<li class="option" tabindex="' + (i + 1) + '" data-val="' + dataValue + '">' + value + '</li>';
                }
            }

            this.suggestions.innerHTML = items;
        }
    }, {
        key: 'showMessage',
        value: function showMessage(elem, elemBefore, msg, msgClass, type) {
            var prevMsg = elem.querySelector('.message.' + msgClass + '[data-type="' + type + '"]');
            if (prevMsg) {
                prevMsg.innerHTML = msg;
            } else {
                var message = document.createElement('span');
                message.classList.add('message');
                message.classList.add(msgClass);
                message.setAttribute('data-type', type);
                message.innerHTML = msg;
                elem.insertBefore(message, elemBefore);
            }
        }
    }, {
        key: 'removeMessage',
        value: function removeMessage(elem, msgClass, type) {
            var message = elem.querySelector('.message.' + msgClass + '[data-type="' + type + '"]');
            message && message.remove();
        }
    }, {
        key: 'sortData',
        value: function sortData() {
            switch (this.options.sort) {
                case 'ASC':
                    this.data.sort();
                    break;
                case 'DESC':
                    this.data.sort().reverse();
                    break;
            }
        }
    }, {
        key: 'match',
        value: function match(str) {
            this.resultData = [];

            var value = this.input.value;
            var regexp = new RegExp('(' + value + ')', 'gi');

            var count = 0;
            var limit = this.options.limit || this.data.length;

            for (var i = 0; i < this.data.length && count < limit; i++) {
                var item = this.data[i];
                var matches = item.match(regexp);
                if (matches) {
                    var string = item.replace(regexp, '<span class="' + this.options.highliteMatchesClass + '">$1</span>');
                    this.resultData[this.resultData.length] = string;
                    count++;
                }
            }
            this.setDialogList();
        }
    }, {
        key: 'selectOption',
        value: function selectOption(option) {
            var str = option.getAttribute('data-val');
            this.input.value = str;
            this.match(str);
            this.close.classList.add('visible');
            this.input.focus();

            str && this.options.onSelect && this.options.onSelect.call(this, str);
        }
    }, {
        key: 'initHandlers',
        value: function initHandlers() {
            this.input.addEventListener('focus', this.onInputFocus.bind(this));
            this.input.addEventListener('keyup', this.onInput.bind(this));
            this.close.addEventListener('click', this.onClose.bind(this));
            this.suggestions.addEventListener('click', this.onSuggestionsClick.bind(this));
            document.addEventListener('keyup', this.onKeyPress.bind(this));
            document.addEventListener('click', this.onOuterClick.bind(this));
        }
    }, {
        key: 'onInputFocus',
        value: function onInputFocus() {
            this.isOpened = true;
        }
    }, {
        key: 'onInput',
        value: function onInput() {
            if (event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 13) {
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
    }, {
        key: 'onClose',
        value: function onClose() {
            this.resultData = this.data;
            this.setDialogList();

            this.close.classList.remove('visible');
            // this.ac.classList.add('active');
            this.isOpened = true;

            this.input.value = '';
            this.input.focus();
        }
    }, {
        key: 'onKeyPress',
        value: function onKeyPress(event) {
            switch (event.keyCode) {
                case 38:
                    // if the UP key is pressed
                    this.focusPrev(document.activeElement);
                    break;
                case 40:
                    // if the DOWN key is pressed
                    this.focusNext(document.activeElement);
                    break;
                case 13:
                    // if the ENTER key is pressed
                    if (this.suggestions.contains(document.activeElement)) {
                        this.selectOption(document.activeElement);
                    }
                    break;
            }
        }
    }, {
        key: 'focusPrev',
        value: function focusPrev(current) {
            if (current == this.input || current == this.suggestions.firstChild) {
                this.input.focus();
            } else if (this.suggestions.contains(current)) {
                if (current.previousSibling.classList.contains('selected')) {
                    this.focusPrev(current.previousSibling);
                } else {
                    current.previousSibling.focus();
                }
            }
        }
    }, {
        key: 'focusNext',
        value: function focusNext(current) {
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
    }, {
        key: 'onOuterClick',
        value: function onOuterClick(event) {
            if (event.target !== this.input && event.target !== this.close && !this.suggestions.contains(event.target)) {
                this.isOpened = false;
            }
        }
    }, {
        key: 'onSuggestionsClick',
        value: function onSuggestionsClick(event) {
            if (this.suggestions.contains(event.target)) {
                this.selectOption(event.target);
            }
        }
    }, {
        key: 'isOpened',
        get: function get() {
            return this._isOpened;
        },
        set: function set(value) {
            this._isOpened = value;
            if (value) {
                this.ac.classList.add('active');
            } else {
                this.ac.classList.remove('active');
            }
        }
    }]);

    return Autocomplete;
}();