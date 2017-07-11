/*jslint esversion: 6 */
/*jslint node: true */
/*global document, alert, fetch, Autocomplete, Chips, countriesData*/

'use strict';
import Autocomplete from "./autocomplete.js";
import Chips from "./chips.js";

// TODO: add JS Doc

let autocompleteInputs = document.querySelectorAll('.present-autocomplete');
let chipsInputs = document.querySelectorAll('.present-chips');

autocompleteInputs = Array.prototype.slice.call(autocompleteInputs);
chipsInputs = Array.prototype.slice.call(chipsInputs);

autocompleteInputs.forEach(curInput => {
    const dataSource = curInput.dataset.src;
    curInput.closest('.form-control').classList.add('loading'); // preloader

    getData(dataSource, curInput).then((result) => {
        const data = Object.keys(result).map(key => result[key]);

        new Autocomplete(curInput, data, {
            onSelect: (value) => {
                curInput.value = value;
                alert(value);
            }
        });
    });
});

chipsInputs.forEach(curInput => {
    const dataSource = curInput.dataset.src;
    curInput.closest('.form-control').classList.add('loading'); // preloader

    getData(dataSource, curInput).then((result) => {
        const data = Object.keys(result).map(key => result[key]);

        new Chips(curInput, data, {
            onSelect: (result) => {
                let str = '<span>' + result.join('</span>, <span>') + '</span>';
                document.querySelector('.result[data-for="#'+curInput.getAttribute('id')+'"]').innerHTML = str;
            }
        });
    });
});

function getData(dataString, curInput) {
    switch (dataString) {
        case 'countries-cors':
            return fetch('https://crossorigin.me/http://country.io/names.json', {
                mode: 'cors',
            }).then(function(result){
                // setTimeout(function () {
                    // console.log('loaded!');
                    curInput.closest('.form-control').classList.remove('loading');
                    return result.json();
                // }, 30000);
            });
        default:
            curInput.closest('.form-control').classList.remove('loading');
            return new Promise((resolve, reject) => {
                resolve(countriesData);
            });
    }
}
