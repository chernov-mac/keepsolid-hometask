'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Chips = exports.ChipsDefaults = undefined;

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

var ChipsDefaults = exports.ChipsDefaults = {
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
				var value = event.target.parentNode.getAttribute('data-val');
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