/*
    JavaScript autoComplete
    Author: Vladimir Chernov
    For KeepSolid Summer Internship 2017
*/

document.addEventListener('DOMContentLoaded', function(){
    'use strict';

    // For those who are lazy to launch the local server for project
    var loadedDataset = {"BD": "Bangladesh", "BE": "Belgium", "BF": "Burkina Faso", "BG": "Bulgaria", "BA": "Bosnia and Herzegovina", "BB": "Barbados", "WF": "Wallis and Futuna", "BL": "Saint Barthelemy", "BM": "Bermuda", "BN": "Brunei", "BO": "Bolivia", "BH": "Bahrain", "BI": "Burundi", "BJ": "Benin", "BT": "Bhutan", "JM": "Jamaica", "BV": "Bouvet Island", "BW": "Botswana", "WS": "Samoa", "BQ": "Bonaire, Saint Eustatius and Saba ", "BR": "Brazil", "BS": "Bahamas", "JE": "Jersey", "BY": "Belarus", "BZ": "Belize", "RU": "Russia", "RW": "Rwanda", "RS": "Serbia", "TL": "East Timor", "RE": "Reunion", "TM": "Turkmenistan", "TJ": "Tajikistan", "RO": "Romania", "TK": "Tokelau", "GW": "Guinea-Bissau", "GU": "Guam", "GT": "Guatemala", "GS": "South Georgia and the South Sandwich Islands", "GR": "Greece", "GQ": "Equatorial Guinea", "GP": "Guadeloupe", "JP": "Japan", "GY": "Guyana", "GG": "Guernsey", "GF": "French Guiana", "GE": "Georgia", "GD": "Grenada", "GB": "United Kingdom", "GA": "Gabon", "SV": "El Salvador", "GN": "Guinea", "GM": "Gambia", "GL": "Greenland", "GI": "Gibraltar", "GH": "Ghana", "OM": "Oman", "TN": "Tunisia", "JO": "Jordan", "HR": "Croatia", "HT": "Haiti", "HU": "Hungary", "HK": "Hong Kong", "HN": "Honduras", "HM": "Heard Island and McDonald Islands", "VE": "Venezuela", "PR": "Puerto Rico", "PS": "Palestinian Territory", "PW": "Palau", "PT": "Portugal", "SJ": "Svalbard and Jan Mayen", "PY": "Paraguay", "IQ": "Iraq", "PA": "Panama", "PF": "French Polynesia", "PG": "Papua New Guinea", "PE": "Peru", "PK": "Pakistan", "PH": "Philippines", "PN": "Pitcairn", "PL": "Poland", "PM": "Saint Pierre and Miquelon", "ZM": "Zambia", "EH": "Western Sahara", "EE": "Estonia", "EG": "Egypt", "ZA": "South Africa", "EC": "Ecuador", "IT": "Italy", "VN": "Vietnam", "SB": "Solomon Islands", "ET": "Ethiopia", "SO": "Somalia", "ZW": "Zimbabwe", "SA": "Saudi Arabia", "ES": "Spain", "ER": "Eritrea", "ME": "Montenegro", "MD": "Moldova", "MG": "Madagascar", "MF": "Saint Martin", "MA": "Morocco", "MC": "Monaco", "UZ": "Uzbekistan", "MM": "Myanmar", "ML": "Mali", "MO": "Macao", "MN": "Mongolia", "MH": "Marshall Islands", "MK": "Macedonia", "MU": "Mauritius", "MT": "Malta", "MW": "Malawi", "MV": "Maldives", "MQ": "Martinique", "MP": "Northern Mariana Islands", "MS": "Montserrat", "MR": "Mauritania", "IM": "Isle of Man", "UG": "Uganda", "TZ": "Tanzania", "MY": "Malaysia", "MX": "Mexico", "IL": "Israel", "FR": "France", "IO": "British Indian Ocean Territory", "SH": "Saint Helena", "FI": "Finland", "FJ": "Fiji", "FK": "Falkland Islands", "FM": "Micronesia", "FO": "Faroe Islands", "NI": "Nicaragua", "NL": "Netherlands", "NO": "Norway", "NA": "Namibia", "VU": "Vanuatu", "NC": "New Caledonia", "NE": "Niger", "NF": "Norfolk Island", "NG": "Nigeria", "NZ": "New Zealand", "NP": "Nepal", "NR": "Nauru", "NU": "Niue", "CK": "Cook Islands", "XK": "Kosovo", "CI": "Ivory Coast", "CH": "Switzerland", "CO": "Colombia", "CN": "China", "CM": "Cameroon", "CL": "Chile", "CC": "Cocos Islands", "CA": "Canada", "CG": "Republic of the Congo", "CF": "Central African Republic", "CD": "Democratic Republic of the Congo", "CZ": "Czech Republic", "CY": "Cyprus", "CX": "Christmas Island", "CR": "Costa Rica", "CW": "Curacao", "CV": "Cape Verde", "CU": "Cuba", "SZ": "Swaziland", "SY": "Syria", "SX": "Sint Maarten", "KG": "Kyrgyzstan", "KE": "Kenya", "SS": "South Sudan", "SR": "Suriname", "KI": "Kiribati", "KH": "Cambodia", "KN": "Saint Kitts and Nevis", "KM": "Comoros", "ST": "Sao Tome and Principe", "SK": "Slovakia", "KR": "South Korea", "SI": "Slovenia", "KP": "North Korea", "KW": "Kuwait", "SN": "Senegal", "SM": "San Marino", "SL": "Sierra Leone", "SC": "Seychelles", "KZ": "Kazakhstan", "KY": "Cayman Islands", "SG": "Singapore", "SE": "Sweden", "SD": "Sudan", "DO": "Dominican Republic", "DM": "Dominica", "DJ": "Djibouti", "DK": "Denmark", "VG": "British Virgin Islands", "DE": "Germany", "YE": "Yemen", "DZ": "Algeria", "US": "United States", "UY": "Uruguay", "YT": "Mayotte", "UM": "United States Minor Outlying Islands", "LB": "Lebanon", "LC": "Saint Lucia", "LA": "Laos", "TV": "Tuvalu", "TW": "Taiwan", "TT": "Trinidad and Tobago", "TR": "Turkey", "LK": "Sri Lanka", "LI": "Liechtenstein", "LV": "Latvia", "TO": "Tonga", "LT": "Lithuania", "LU": "Luxembourg", "LR": "Liberia", "LS": "Lesotho", "TH": "Thailand", "TF": "French Southern Territories", "TG": "Togo", "TD": "Chad", "TC": "Turks and Caicos Islands", "LY": "Libya", "VA": "Vatican", "VC": "Saint Vincent and the Grenadines", "AE": "United Arab Emirates", "AD": "Andorra", "AG": "Antigua and Barbuda", "AF": "Afghanistan", "AI": "Anguilla", "VI": "U.S. Virgin Islands", "IS": "Iceland", "IR": "Iran", "AM": "Armenia", "AL": "Albania", "AO": "Angola", "AQ": "Antarctica", "AS": "American Samoa", "AR": "Argentina", "AU": "Australia", "AT": "Austria", "AW": "Aruba", "IN": "India", "AX": "Aland Islands", "AZ": "Azerbaijan", "IE": "Ireland", "ID": "Indonesia", "UA": "Ukraine", "QA": "Qatar", "MZ": "Mozambique"};

    var data = {};
    var ac = document.getElementById('names');
    var input = ac.getElementsByTagName('input')[0];
    var close = ac.getElementsByClassName('close')[0];
    var dialog = ac.getElementsByClassName('dialog')[0];

    // FUNCTIONS

    function getJSONData(path) {
        var request = new XMLHttpRequest();
        request.open('GET', path, true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                var dataset = JSON.parse(request.responseText);
                initDialog(dataset);
                return dataset;
            } else {
                console.error('Returned an error');
            }
        };
        request.onerror = function() {
            console.error('Connection error. Hardcoded dataset used. Launch local server to make http requests work.');
            initDialog(loadedDataset);
        };

        request.send();
    }

    function clearDialog() {
        dialog.innerHTML = '';
    }

    function initDialog(dataset) {
        data = Object.values(dataset).sort();
        setDialogList();
    }

    function setDialogList() {
        clearDialog();
        for (let i = 0; i < data.length; i++) {
            let elem = document.createElement('div');
            let text = document.createTextNode(data[i]);
            elem.appendChild(text);
            elem.classList.add('option');
            elem.setAttribute('tabindex', i+1);
            elem.setAttribute('data-val', data[i]);
            dialog.appendChild(elem);
        }
    }

    function match(str) {
        str = str.toLowerCase();
        ac.getElementsByClassName('form-control')[0].classList.remove('red');
        clearDialog();

        var count = 0;
        for (let i = 0; i < data.length; i++) {
            let row = '';

            let pos = 0;
            while (true) {
                let foundPos = data[i].toLowerCase().indexOf(str, pos);

                if (foundPos == -1) {
                    if (pos === 0) break;
                    else {
                        row += data[i].substr(pos);

                        let elem = document.createElement('div');
                        elem.innerHTML = row;
                        elem.classList.add('option');
                        elem.setAttribute('tabindex', count+1);
                        elem.setAttribute('data-val', data[i]);
                        dialog.appendChild(elem);
                        count++;

                        break;
                    }
                } else {
                    row += data[i].slice(pos, foundPos) +
                        '<span class="highlite">' +
                            data[i].substr(foundPos, str.length) +
                        '</span>';
                    pos = foundPos + str.length;
                }
            }
            if (count >= 5) break;
        }
        if (count === 0) {
            ac.getElementsByClassName('form-control')[0].classList.add('red');

            let elem = document.createElement('div');
            elem.innerHTML = 'No matches';
            dialog.appendChild(elem);
        }
    }

    function selectOption(str) {
        alert('You chose '+str);
        input.value = str;
        input.focus();
        dialog.classList.remove('open');
        close.classList.add('visible');
    }

    // HANDLERS

    input.onclick = function() {
        dialog.classList.add('open');
    };

    input.onkeyup = function() {
        close.classList.add('visible');
        if (this.value.length > 0) match(this.value);
        else {
            close.classList.remove('visible');
            setDialogList();
        }
    };

    close.onclick = function() {
        setDialogList();

        close.classList.remove('visible');
        dialog.classList.add('open');

        input.value = '';
        input.focus();
    };

    document.body.onclick = function(event) {
        event = event || window.event;

        if (event.target.tagName.toLowerCase() !== 'input' && !event.target.classList.contains('close')) {
            dialog.classList.remove('open');
        }

        if (event.target.classList.contains('option')) {
            selectOption(event.target.getAttribute('data-val'));
        }
    };

    document.onkeydown = function(e) {
        switch (e.keyCode) {
            case 38: // if the UP key is pressed
                if (document.activeElement == input || document.activeElement == dialog.firstChild) { input.focus(); }
                else if (document.activeElement.classList.contains('option')) { document.activeElement.previousSibling.focus(); }
                break;
            case 40: // if the DOWN key is pressed
                if (document.activeElement == input) { dialog.firstChild.focus(); }
                else if (document.activeElement == dialog.lastChild) { break; }
                else if (document.activeElement.classList.contains('option')) { document.activeElement.nextSibling.focus(); }
                break;
            case 13: // if the ENTER key is pressed
                if (document.activeElement.classList.contains('option')) {
                    selectOption(document.activeElement.getAttribute('data-val'));
                 }
                break;
        }
    };

    getJSONData('../data/names.json');

});
