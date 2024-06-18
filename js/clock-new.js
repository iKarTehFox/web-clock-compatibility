'use strict';

var cMode = '0';
var dateFormat = 'D';
var timeDisplayMethod = 0;
menu.timeMethodSelect.addEventListener('change', function () {
    // Get the selected value from the select element
    var selectedValue = menu.timeMethodSelect.value;

    // Update the timeDisplayMethod variable with the selected value
    timeDisplayMethod = selectedValue;

    // Update the time display using updateTime()
    updateTime();
});

// Page duration elements
var pageLoadTime = Date.now();
function updatePageDuration() {
    var currentTime = Date.now();
    var timeDiff = currentTime - pageLoadTime;

    // Convert the time difference to seconds, minutes, and hours
    var seconds = Math.floor(timeDiff / 1000) % 60;
    var minutes = Math.floor(timeDiff / (1000 * 60)) % 60;
    var hours = Math.floor(timeDiff / (1000 * 60 * 60));
    menu.durationdisplay.textContent = ''.concat(hours, 'h, ').concat(minutes, 'm, and ').concat(seconds, 's');
}

// Clock mode radio
menu.clockmoderadio.forEach(function (radio) {
    radio.addEventListener('change', function () {
        var value = radio.dataset.value;
        cMode = value;
    });
});

// Date format selector listener
menu.dateformselect.addEventListener('change', function () {
    dateFormat = menu.dateformselect.value;
    updateDate();
});
function updateTime() {
    var time = luxon.DateTime.now();
    var hrs = cMode === '0' ? time.toFormat('h') : time.toFormat('HH');
    var min = time.toFormat('mm');
    var sec = time.toFormat('ss');
    var ind = cMode === '0' ? time.toFormat('a') : '';

    if (menu.titlevischeckbox.checked) {
        updateFavicon(time.toFormat('h'));
        document.title = 'Time: '.concat(hrs, ':').concat(min, ':').concat(sec, ' ').concat(ind);
    } else if (document.title !== 'Online Web Clock' || !doc.favicon.href.endsWith('/icons/clock-time-3.ico')) {
        updateFavicon(3);
        document.title = 'Online Web Clock';
        if (menu.debugcheckbox.checked) {console.log('DEBUG - Title and favicon reset...');}
    }
    

    // Seconds progress bar
    var secBarWidth = sec / 59 * 100;
    dtdisplay.secondsBar.style.width = ''.concat(secBarWidth, '%');

    // Time display methods
    var timeDisplayFunctions = {
        binary: toBinary,
        emoji: convertToEmojiBlock,
        roman: convertToRomanNumerals,
        hexa: toHexadecimal,
        hexatri: toHexatrigesimal,
        octal: toOctal,
        words: toWords,
        unixmillis: toUnixMillis,
        unixsec: toUnixSec,
        unixcountdown: toUnixMillis
    };
    if (Object.prototype.hasOwnProperty.call(timeDisplayFunctions, timeDisplayMethod)) {
        var displayFunction = timeDisplayFunctions[timeDisplayMethod];
        dtdisplay.hourSlot.textContent = displayFunction(hrs);

        // Hacky implementation... Will fix logic instead in future release.
        if (timeDisplayMethod === 'unixmillis' || timeDisplayMethod === 'unixsec') {
            dtdisplay.hourSlot.textContent = '';
            dtdisplay.minuteSlot.textContent = displayFunction();
            dtdisplay.secondSlot.textContent = '';
            dtdisplay.indicatorSlot.textContent = '';
            return;
        } else if (timeDisplayMethod === 'unixcountdown') {
            var secondsUntilY2K38 = 2147483647 - Math.floor(Date.now() / 1000);
            dtdisplay.hourSlot.textContent = ''.concat(Math.floor(secondsUntilY2K38 / 3600), 'h');
            dtdisplay.minuteSlot.textContent = ''.concat(Math.floor(secondsUntilY2K38 % 3600 / 60), 'm');
            dtdisplay.secondSlot.textContent = ''.concat(secondsUntilY2K38 % 60, 's');
            dtdisplay.indicatorSlot.textContent = '';
            return;
        }
        if (timeDisplayMethod === 'words') {
            dtdisplay.minuteSlot.textContent = formatMinutesForWordsDisplay(min);
        } else {
            dtdisplay.minuteSlot.textContent = displayFunction(min);
        }
        dtdisplay.secondSlot.textContent = displayFunction(sec);
    } else {
        dtdisplay.hourSlot.textContent = hrs;
        dtdisplay.minuteSlot.textContent = min;
        dtdisplay.secondSlot.textContent = sec;
    }
    dtdisplay.indicatorSlot.textContent = ind;
}

// Helper function for time display method 'words'
function formatMinutesForWordsDisplay(min) {
    var parsedMinutes = parseInt(min, 10);
    if (parsedMinutes === 0) {
        return 'o\'clock';
    } else if (parsedMinutes < 10) {
        return 'oh '.concat(numberToWords.toWords(parsedMinutes));
    } else {
        return numberToWords.toWords(parsedMinutes);
    }
}

// Helper functions for time display methods
function toBinary(value) {
    return parseInt(value, 10).toString(2);
}
function toOctal(value) {
    return parseInt(value, 10).toString(8);
}
function toHexadecimal(value) {
    return parseInt(value, 10).toString(16);
}
function toHexatrigesimal(value) {
    return parseInt(value, 10).toString(36);
}
function toWords(value) {
    return numberToWords.toWords(value);
}

// Unix timestamp functions
function toUnixMillis() {
    return Date.now();
}
function toUnixSec() {
    return Math.floor(Date.now() / 1000);
}
function updateDate() {
    var time = luxon.DateTime.now();
    dtdisplay.date.textContent = time.toFormat(dateFormat);
    Array.from(menu.dateformselect.children).forEach(function (child) {
        if (child.value !== '') {
            child.textContent = time.toFormat(child.value);
        }
    });
}

// Change tab favicon function
function updateFavicon(hour) {
    doc.favicon.href = './icons/clock-time-'.concat(hour, '.ico');
}

// Emoji block function
function convertToEmojiBlock(number) {
    var emojiBlocks = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
    var digits = number.toString().split('');
    var emojiDigits = digits.map(function (digit) {
        return emojiBlocks[parseInt(digit, 10)];
    });
    return emojiDigits.join('');
}

// Roman numeral converter function
function convertToRomanNumerals(number) {
    if (isNaN(number)) return NaN;
    if (number === 0 || number === '00') return number;
    var digits = String(+number).split(''),
        key = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM', '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC', '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'],
        roman = '',
        i = 3;
    while (i--) roman = (key[+digits.pop() + i * 10] || '') + roman;
    return Array(+digits.join('') + 1).join('M') + roman;
}

// Update on load, then start intervals
var time = luxon.DateTime.now();
updateTime();
updateDate();
updateFavicon(time.toFormat('h'));
setInterval(function () {
    updateTime();
    updatePageDuration();
    if (menu.debugcheckbox.checked) {console.log('DEBUG - Time and page duration updated...');}
}, 250);
setInterval(function () {
    updateDate();
    if (menu.debugcheckbox.checked) {console.log('DEBUG - Date updated...');}
}, 15000);