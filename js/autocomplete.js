/*
*    JavaScript autoComplete
*    Author: Vladimir Chernov
*    For KeepSolid Summer Internship 2017
*/
/*jslint esversion: 6 */

const defaultOptions = {
    noSuggestionText: 'No matches',
    arrowNavigation: true,
    symbolsToStart: 1, // start matching from this symbols amount
    limit: 5, // 0 - all suggestions
    sort: 'ASC', // ASC || DESC
    onSelect: null, // callback function on item select
    errorClass: 'error', // sort order
    highliteMatchesClass: 'highlite' // span.highlite
};

class Autocomplete {

    constructor(input, data, options) {

        this.input = input;
        this.data = data;
        this.options = Object.assign({}, defaultOptions, options); // merge options
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
        this.fc = this.input.closest('.form-control');
        if (!this.fc) {
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
        this.ac.appendChild(this.close);
    }

    createDialog() {
        // create dialog to contain spacer and suggestions block with options
        let spacer = document.createElement('div');
        spacer.classList.add('spacer');
        let suggestions = document.createElement('ul');
        suggestions.classList.add('suggestions');
        this.dialog = document.createElement('div');
        this.dialog.classList.add('dialog');
        this.dialog.appendChild(spacer);
        this.dialog.appendChild(suggestions);
        this.ac.appendChild(this.dialog);
        this.suggestions = suggestions;
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
            items = `<li class="${this.options.errorClass}">${this.options.noSuggestionText}</li>`;
        } else {
            const hl = new RegExp(`<span.*?>(.+?)</span>`, 'gi');

            for (let i = 0; i < this.resultData.length; i++) {
                let value = this.resultData[i];

                let dataValue = value.replace(hl, '$1');

                items += `<li class="option" tabindex="${i + 1}" data-val="${dataValue}">${value}</li>`;
            }
        }

        this.suggestions.innerHTML = items;
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

    selectOption(str) {
        this.input.value = str;
        str && this.options.onSelect && this.options.onSelect.call(this, str);
        this.match(str);
        this.input.focus();
        this.close.classList.add('visible');
    }

    initHandlers() {
        this.input.addEventListener('focus', this.onInputFocus.bind(this));
        this.input.addEventListener('keyup', this.onInput.bind(this));
        this.close.addEventListener('click', this.onClose.bind(this));
        document.addEventListener('keyup', this.onKeyPress.bind(this));
        document.addEventListener('click', this.onOuterClick.bind(this));
    }

    onInputFocus() {
        this.isOpened = true;
    }

    onInput() {
        this.close.classList.add('visible');
        if (this.input.value.length >= this.options.symbolsToStart) {
            if(event.keyCode != 38 && event.keyCode != 40) {
                this.match(this.input.value);
            }
        } else {
            this.close.classList.remove('visible');
            this.resultData = this.data;
            this.setDialogList();
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
                if (document.activeElement == this.input || document.activeElement == this.suggestions.firstChild) { this.input.focus(); }
                else if (this.suggestions.contains(document.activeElement)) { document.activeElement.previousSibling.focus(); }
                break;
            case 40: // if the DOWN key is pressed
                if (document.activeElement == this.input) { this.suggestions.firstChild.focus(); }
                else if (document.activeElement == this.suggestions.lastChild) { break; }
                else if (this.suggestions.contains(document.activeElement)) { document.activeElement.nextSibling.focus(); }
                break;
            case 13: // if the ENTER key is pressed
                if (this.suggestions.contains(document.activeElement)) {
                    this.selectOption(document.activeElement.getAttribute('data-val'));
                }
                break;
        }
    }

    onOuterClick(event) {
        if (event.target !== this.input && event.target !== this.close && !this.suggestions.contains(event.target)) {
            this.isOpened = false;
        }

        if (this.suggestions.contains(document.activeElement)) {
            this.selectOption(event.target.getAttribute('data-val'));
        }
    }

}
