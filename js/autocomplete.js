/*
    JavaScript autoComplete
    Author: Vladimir Chernov
    For KeepSolid Summer Internship 2017
*/

'use strict';

class Autocomplete {

    constructor(options) {

        // options
        this.limit = options.limit || 5;
        this.symbolsToStart = options.symbolsToStart || 1;

        // wrap input in customizable boxes
        this.input = document.querySelector(options.element);
        // div.form-control to contain input itself
        this.fc = document.createElement('div');
        this.fc.classList.add('form-control');
        // div.autocomplete to contain .form-group, .dialog and buttons
        this.ac = document.createElement('div');
        this.ac.classList.add('autocomplete');
        this.ac.appendChild(this.fc);
        this.input.parentNode.insertBefore(this.ac, this.input);
        let origin = this.input.cloneNode(true);
        this.input.parentNode.removeChild(this.input);
        this.fc.appendChild(origin);
        this.input = origin;

        // create close button
        this.close = document.createElement('span');
        this.close.classList.add('close');
        this.ac.appendChild(this.close);

        // create dialog to contain spacer and body with options
        let spacer = document.createElement('div');
        spacer.classList.add('spacer');
        let dialogBody = document.createElement('div');
        dialogBody.classList.add('body');
        this.dialog = document.createElement('div');
        this.dialog.classList.add('dialog');
        this.dialog.appendChild(spacer);
        this.dialog.appendChild(dialogBody);
        this.ac.appendChild(this.dialog);
        this.dialog = dialogBody;

        // load data and init work
        if(options.data) {
            this.data = Object.values(options.data).sort();
            this.setDialogList();
        } else if(options.dataURL) {
            this.getDataByURL(options.dataURL);
        } else {
            console.error('There is no data to autocomplete.');
            return false;
        }

        // HANDLERS

        var _ = this;

        _.input.addEventListener('click', function(){
            _.ac.classList.add('active');
            _.dialog.classList.add('open');
        });

        _.input.addEventListener('keyup', function(e){
            _.close.classList.add('visible');
            if (this.value.length >= _.symbolsToStart) {
                if(e.keyCode != 38 && e.keyCode != 40) {
                    _.match(this.value);
                }
            } else {
                _.close.classList.remove('visible');
                _.setDialogList();
            }
        });

        _.close.addEventListener('click', function(){
            _.setDialogList();

            _.close.classList.remove('visible');
            _.ac.classList.add('active');
            _.dialog.classList.add('open');


            _.input.value = '';
            _.input.focus();
        });

        document.body.addEventListener('click', function(e){
            event = event || window.event;

            if (event.target !== _.input) {
                _.ac.classList.remove('active');
                _.dialog.classList.remove('open');
            }

            if (event.target.classList.contains('option') && _.dialog.contains(document.activeElement)) {
                _.selectOption(event.target.getAttribute('data-val'));
            }
        });

        document.addEventListener('keyup', function(e){
            switch (e.keyCode) {
                case 38: // if the UP key is pressed
                    if (document.activeElement == _.input || document.activeElement == _.dialog.firstChild) { _.input.focus(); }
                    else if (_.dialog.contains(document.activeElement)) { document.activeElement.previousSibling.focus(); }
                    break;
                case 40: // if the DOWN key is pressed
                    if (document.activeElement == _.input) { _.dialog.firstChild.focus(); }
                    else if (document.activeElement == _.dialog.lastChild) { break; }
                    else if (_.dialog.contains(document.activeElement)) { document.activeElement.nextSibling.focus(); }
                    break;
                case 13: // if the ENTER key is pressed
                    if (_.dialog.contains(document.activeElement)) {
                        _.selectOption(document.activeElement.getAttribute('data-val'));
                    }
                    break;
            }
        });
    }

    getDataByURL(url) {
        var _ = this;

        fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(result){
                _.data = Object.values(result).sort();
                _.setDialogList();
            })
            .catch(console.log);
    }

    clearDialog() {
        this.dialog.innerHTML = '';
        this.fc.classList.remove('red');
    }

    setDialogList() {
        this.clearDialog();
        for (let i = 0; i < this.data.length; i++) {
            let elem = document.createElement('div');
            let text = document.createTextNode(this.data[i]);
            elem.appendChild(text);
            elem.classList.add('option');
            elem.setAttribute('tabindex', i+1);
            elem.setAttribute('data-val', this.data[i]);
            this.dialog.appendChild(elem);
        }
    }

    match(str) {
        str = str.toLowerCase();
        this.fc.classList.remove('red');
        this.clearDialog();

        var count = 0;
        for (let i = 0; i < this.data.length; i++) {
            let row = '';

            let pos = 0;
            while (true) {
                let foundPos = this.data[i].toLowerCase().indexOf(str, pos);

                if (foundPos == -1) {
                    if (pos === 0) break;
                    else {
                        row += this.data[i].substr(pos);

                        let elem = document.createElement('div');
                        elem.innerHTML = row;
                        elem.classList.add('option');
                        elem.setAttribute('tabindex', count+1);
                        elem.setAttribute('data-val', this.data[i]);
                        this.dialog.appendChild(elem);
                        count++;

                        break;
                    }
                } else {
                    row += this.data[i].slice(pos, foundPos) +
                        '<span class="highlite">' +
                            this.data[i].substr(foundPos, str.length) +
                        '</span>';
                    pos = foundPos + str.length;
                }
            }
            if (count >= this.limit) break;
        }
        if (count === 0) {
            this.fc.classList.add('red');

            let elem = document.createElement('div');
            elem.classList.add('error');
            elem.innerHTML = 'No matches';
            this.dialog.appendChild(elem);
        }
    }

    selectOption(str) {
        alert('You chose '+str);
        this.input.value = str;
        this.input.focus();
        this.dialog.classList.remove('open');
        this.close.classList.add('visible');
    }

}
