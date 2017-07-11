(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Chips = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _autocomplete = require('./autocomplete.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
*    JavaScript Autocomplete
*    Author: Vladimir Chernov
*    For KeepSolid Summer Internship 2017
*/
/*jslint esversion: 6 */

var ChipsDefaults = {
	maxChipsNumber: 4, // 0 - without limit
	maxChipsText: 'Maximum number of chips reached.',
	isSelectedText: 'This option is already selected.',
	selectOnlyOnce: true,
	removable: true,
	removeBtnText: '&times;',
	toggleOnSelect: false // override selectOnlyOnce (as false)
};

var Chips = exports.Chips = function (_Autocomplete) {
	_inherits(Chips, _Autocomplete);

	function Chips(input, data, options) {
		_classCallCheck(this, Chips);

		var _this = _possibleConstructorReturn(this, (Chips.__proto__ || Object.getPrototypeOf(Chips)).call(this, input, data, options));

		_this.options = Object.assign({}, ChipsDefaults, _this.options);
		_this.chips = []; // array of strings
		_this.chipsList = []; // DOM element div.chips-list
		_this.chipsElem; // DOM element div.autocomplete.chips

		_this.setChipsList();
		_this.markSelectedOptions();
		return _this;
	}

	_createClass(Chips, [{
		key: 'setChipsList',
		value: function setChipsList() {
			this.ac.classList.add('chips');
			this.chipsElem = this.ac;
			this.chipsList = document.createElement('div');
			this.chipsList.classList.add('chips-list');
			this.chipsElem.insertBefore(this.chipsList, this.fc);

			if (this.chips.length) {
				this.updateChipsList();
			}

			this.chipsList.addEventListener('click', this.chipsClick.bind(this));
		}
	}, {
		key: 'updateChipsList',
		value: function updateChipsList() {
			this.removeMessage(this.ac, 'error', 'isSelected');

			var removeBtn = this.options.removable ? ' <span class="remove">&times;</span>' : '';
			var classList = this.options.removable ? 'chip removable' : 'chip';

			var list = '';
			this.chips.forEach(function (chip) {
				list += '<span class="' + classList + '" data-val="' + chip + '">' + chip + removeBtn + '</span>';
			});

			this.chipsList.innerHTML = list;
			this.markSelectedOptions();
			this.isMaxAmount();

			this.options.onSelect && this.options.onSelect.call(this, this.chips);
		}
	}, {
		key: 'addChip',
		value: function addChip(str) {
			this.chips[this.chips.length] = str;
			this.updateChipsList();
		}
	}, {
		key: 'removeChip',
		value: function removeChip(str) {
			var chip = this.chipsList.querySelector('[data-val="' + str + '"]');

			for (var i = 0; i < this.chips.length; i++) {
				if (this.chips[i] === str) {
					this.chips.splice(i, 1);
					break;
				}
			}
			this.updateChipsList();
		}
	}, {
		key: 'markSelectedOptions',
		value: function markSelectedOptions() {
			var _this2 = this;

			var options = this.suggestions.querySelectorAll('.option');
			options.forEach(function (option) {
				var value = option.getAttribute('data-val');
				if (_this2.chips.includes(value)) {
					_this2.markOption(option);
				} else {
					_this2.unmarkOption(option);
				}
			});
		}
	}, {
		key: 'markOption',
		value: function markOption(option) {
			option.classList.add('selected');
			option.removeAttribute('tabindex');
		}
	}, {
		key: 'unmarkOption',
		value: function unmarkOption(option) {
			option.classList.remove('selected');
			var index = this.resultData.indexOf(option.getAttribute('data-val'));
			option.setAttribute('tabindex', index);
		}
	}, {
		key: 'toggleMarking',
		value: function toggleMarking(option) {
			if (option.classList.contains('selected')) {
				this.unmarkOption(option);
			} else {
				this.markOption(option);
			}
		}
	}, {
		key: 'isMaxAmount',
		value: function isMaxAmount() {
			if (this.options.maxChipsNumber && this.chips.length >= this.options.maxChipsNumber) {
				this.showMessage(this.ac, this.chipsList, this.options.maxChipsText, 'error', 'maxChipsNumber');
				return true;
			} else {
				this.removeMessage(this.ac, 'error', 'maxChipsNumber');
				return false;
			}
		}
	}, {
		key: 'selectOption',
		value: function selectOption(option) {
			var str = option.getAttribute('data-val');

			if (!this.isMaxAmount() && this.isAvailable(str)) {
				this.addChip(str);
			}
			this.markSelectedOptions();
		}
	}, {
		key: 'toggleOption',
		value: function toggleOption(option) {
			var str = option.getAttribute('data-val');

			if (!this.isMaxAmount() && this.isAvailable(str)) {
				this.addChip(str);
			} else {
				this.removeChip(str);
			}

			this.markSelectedOptions();
		}
	}, {
		key: 'isAvailable',
		value: function isAvailable(str) {
			if (this.isSelected(str) && this.options.selectOnlyOnce) {
				this.showMessage(this.ac, this.chipsList, this.options.isSelectedText, 'error', 'isSelected');
				return false;
			}
			return true;
		}
	}, {
		key: 'isSelected',
		value: function isSelected(str) {
			return this.chips.includes(str) ? true : false;
		}
	}, {
		key: 'chipsClick',
		value: function chipsClick(event) {
			if (event.target.classList.contains('remove')) {
				var value = event.target.closest('.chip').getAttribute('data-val');
				this.removeChip(value);
			}
		}
	}, {
		key: 'onInput',
		value: function onInput() {
			_get(Chips.prototype.__proto__ || Object.getPrototypeOf(Chips.prototype), 'onInput', this).call(this);
			this.markSelectedOptions();
		}
	}, {
		key: 'onClose',
		value: function onClose() {
			_get(Chips.prototype.__proto__ || Object.getPrototypeOf(Chips.prototype), 'onClose', this).call(this);
			this.markSelectedOptions();
		}
	}, {
		key: 'onSuggestionsClick',
		value: function onSuggestionsClick(event) {
			this.removeMessage(this.ac, 'error', 'isSelected');

			if (this.suggestions.contains(event.target) && !this.options.toggleOnSelect) {
				this.selectOption(event.target);
			} else if (this.suggestions.contains(event.target) && this.options.toggleOnSelect) {
				this.toggleOption(event.target);
			}

			this.isMaxAmount();
			this.input.focus();
		}
	}]);

	return Chips;
}(_autocomplete.Autocomplete);
},{"./autocomplete.js":1}],3:[function(require,module,exports){
/*jslint esversion: 6 */
/*jslint node: true */
/*global document, alert, fetch, Autocomplete, Chips, countriesData*/

'use strict';

var _autocomplete = require("./autocomplete.js");

var _autocomplete2 = _interopRequireDefault(_autocomplete);

var _chips = require("./chips.js");

var _chips2 = _interopRequireDefault(_chips);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: add JS Doc

var autocompleteInputs = document.querySelectorAll('.present-autocomplete');
var chipsInputs = document.querySelectorAll('.present-chips');

autocompleteInputs = Array.prototype.slice.call(autocompleteInputs);
chipsInputs = Array.prototype.slice.call(chipsInputs);

autocompleteInputs.forEach(function (curInput) {
    var dataSource = curInput.dataset.src;
    curInput.closest('.form-control').classList.add('loading'); // preloader

    getData(dataSource, curInput).then(function (result) {
        var data = Object.keys(result).map(function (key) {
            return result[key];
        });

        new _autocomplete2.default(curInput, data, {
            onSelect: function onSelect(value) {
                curInput.value = value;
                alert(value);
            }
        });
    });
});

chipsInputs.forEach(function (curInput) {
    var dataSource = curInput.dataset.src;
    curInput.closest('.form-control').classList.add('loading'); // preloader

    getData(dataSource, curInput).then(function (result) {
        var data = Object.keys(result).map(function (key) {
            return result[key];
        });

        new _chips2.default(curInput, data, {
            onSelect: function onSelect(result) {
                var str = '<span>' + result.join('</span>, <span>') + '</span>';
                document.querySelector('.result[data-for="#' + curInput.getAttribute('id') + '"]').innerHTML = str;
            }
        });
    });
});

function getData(dataString, curInput) {
    switch (dataString) {
        case 'countries-cors':
            return fetch('https://crossorigin.me/http://country.io/names.json', {
                mode: 'cors'
            }).then(function (result) {
                // setTimeout(function () {
                // console.log('loaded!');
                curInput.closest('.form-control').classList.remove('loading');
                return result.json();
                // }, 30000);
            });
        default:
            curInput.closest('.form-control').classList.remove('loading');
            return new Promise(function (resolve, reject) {
                resolve(countriesData);
            });
    }
}
},{"./autocomplete.js":1,"./chips.js":2}]},{},[3]);
