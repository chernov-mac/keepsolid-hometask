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