/*jslint esversion: 6 */
/*jslint node: true */
/*global document, alert, fetch, Autocomplete, Chips, countriesData*/

'use strict';

// TODO: add JS Doc

let autocompleteInputs = document.querySelectorAll('.names-inputs');
autocompleteInputs = Array.prototype.slice.call(autocompleteInputs);

autocompleteInputs.forEach(curInput => {
    const dataSource = curInput.dataset.src;
    curInput.closest('.form-control').classList.add('loading'); // for preloader

    getData(dataSource, curInput).then((result) => {

        const data = Object.keys(result).map(key => result[key]);

        // new Autocomplete(curInput, data, {
        //     onSelect: (value) => {
        //         curInput.value = value;
        //         alert(value);
        //     }
        // });
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
