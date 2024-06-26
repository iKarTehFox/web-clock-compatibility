'use strict';

function getSolidColorValue() {
    var checkedColorInput = document.querySelector('input[name="preset-color-radio"]:checked');
    if (checkedColorInput) {
        var colorValue = checkedColorInput.dataset.color;
        return colorValue;
    } else {
        return '#FFFFFF';
    }
}
function exportSettingsToJSON() {
    // Get time and set export timestamp
    var time = luxon.DateTime.now();
    var timeExported = time.toFormat('FFFF');

    // Get all settings
    var usersettings = {
        clockConfig: {
            clockMode: document.querySelector('input[name="clock-mode-radio"]:checked').id,
            clockDisplay: menu.timeMethodSelect.value,
            secondsVis: document.querySelector('input[name="seconds-vis-radio"]:checked').id,
            dateFormat: menu.dateformselect.value,
            dateAlign: document.querySelector('input[name="date-position-radio"]:checked').id,
            borderMode: document.querySelector('input[name="border-type-radio"]:checked').id,
            borderStyle: menu.borderstyleselect.value,
            secondsBarVis: document.querySelector('input[name="seconds-bar-radio"]:checked').id
        },
        fontConfig: {
            fontFamily: font.familysel.value,
            fontStyle: document.querySelector('input[name="font-style-radio"]:checked').id,
            fontWeight: document.querySelector('input[name="font-weight-radio"]:checked').id,
            fontSize: font.sizesel.value,
            dropShadow: font.shadowrange.value
        },
        colorTheme: {
            colorMode: document.querySelector('input[name="color-mode-radio"]:checked').id,
            solidColor: document.querySelector('input[name="color-mode-radio"]:checked').id == 'solidmode' ? getSolidColorValue() : '',
            textColorMode: document.querySelector('input[name="text-color-override-radio"]:checked').id,
            textColorValue: document.querySelector('input[name="text-color-override-radio"]:checked').id == 'tcovO' ? menu.textcolorinput.value : '',
            bgImage: document.querySelector('input[name="color-mode-radio"]:checked').id == 'imgmode' ? document.body.style.backgroundImage : '',
            bgImageSize: document.querySelector('input[name="color-mode-radio"]:checked').id == 'imgmode' ? menu.imagesizeselect.value : '',
            bgImageBlur: document.querySelector('input[name="color-mode-radio"]:checked').id == 'imgmode' ? menu.imageblurrange.value : ''
        },
        exportTimestamp: timeExported,
        version: 6
    };
    var settingsJSON = JSON.stringify(usersettings);
    var blob = new Blob([settingsJSON], {
        type: 'application/json'
    });
    var url = URL.createObjectURL(blob);

    // Initiate download
    var downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'usdonlineclock-settings_'.concat(time.toFormat('X'), '.json');
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// Function to handle the import process
function importSettingsFromJSON() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    // Listen for changes in the input file selection
    input.addEventListener('change', function (e) {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            try {
                var importedSettings = JSON.parse(e.target.result);

                // File validation
                var validation = verifySettingsJSON(importedSettings);
                if (validation !== true) {
                    handleValidationFailure(validation);
                    return;
                }
                updateClockSettings(importedSettings);
                if (menu.debugcheckbox.checked) {console.log('DEBUG - Settings successfully loaded!');}
                alert('Settings successfully imported!\nFile timestamp: '.concat(importedSettings.exportTimestamp ? importedSettings.exportTimestamp : 'Unknown or missing timestamp'));
            } catch (error) {
                console.error('ERROR - Error importing settings:', error);
                alert('Invalid settings file. Please make sure the file contains valid JSON and check the console for any errors.');
            }
        };
        reader.readAsText(file);
    });
    input.click();
}

// Alternative function for text input
function manualJSONImport() {
    var jsontext = menu.manualjsontextinput.value;
    if (jsontext) {
        try {
            var importedSettings = JSON.parse(jsontext);
            var validation = verifySettingsJSON(importedSettings);
            if (validation !== true) {
                handleValidationFailure(validation);
                return;
            }
            updateClockSettings(importedSettings);
            if (menu.debugcheckbox.checked) {console.log('DEBUG - Settings successfully loaded!');}
            alert('Settings successfully imported!\nFile timestamp: '.concat(importedSettings.exportTimestamp ? importedSettings.exportTimestamp : 'Unknown or missing timestamp'));

            // Clear text field after completion
            menu.manualjsontextinput.value = '';
        } catch (error) {
            console.error('ERROR - Error importing settings:', error);
            alert('Invalid settings file. Please make sure the file contains valid JSON.');
        }
    }
}
function presetLocalJSON(filename) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/assets/' + filename + '.json', true);
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {  // Done
            if (xhr.status === 200) {  // OK
                try {
                    var importedSettings = JSON.parse(xhr.responseText);
                    if (menu.debugcheckbox.checked) {
                        console.log("DEBUG - Attempting to load settings from preset '".concat(filename, "'...!"));
                    }
                    var validation = verifySettingsJSON(importedSettings);
                    if (validation !== true) {
                        handleValidationFailure(validation);
                        return;
                    }
                    updateClockSettings(importedSettings);
                    if (menu.debugcheckbox.checked) {
                        console.log('DEBUG - Settings successfully loaded!');
                    }
                    alert('Settings successfully imported!\nFile timestamp: ' + 
                          (importedSettings.exportTimestamp ? importedSettings.exportTimestamp : 'Unknown or missing timestamp'));
                } catch (error) {
                    console.error('ERROR - Error parsing JSON:', error);
                    alert('Invalid settings file. Please make sure the file contains valid JSON.');
                }
            } else {
                console.error('ERROR - Error importing settings:', xhr.status, xhr.statusText);
                alert('Invalid settings file. Please make sure the file contains valid JSON.');
            }
        }
    };
    
    xhr.send();
}
function updateClockSettings(importedSettings) {
    // Update clockConfig settings
    var clockConfig = importedSettings.clockConfig;
    document.querySelector('input[name="clock-mode-radio"][id="'.concat(clockConfig.clockMode, '"]')).checked = true;
    menu.timeMethodSelect.value = clockConfig.clockDisplay;
    document.querySelector('input[name="seconds-vis-radio"][id="'.concat(clockConfig.secondsVis, '"]')).checked = true;
    menu.dateformselect.value = clockConfig.dateFormat;
    document.querySelector('input[name="date-position-radio"][id="'.concat(clockConfig.dateAlign, '"]')).checked = true;
    if (clockConfig.secondsBarVis === 'sbaN') {
        document.querySelector('input[name="border-type-radio"][id="'.concat(clockConfig.borderMode, '"]')).checked = true;
    }
    menu.borderstyleselect.value = clockConfig.borderStyle;
    if (clockConfig.borderMode === 'btyD') {
        document.querySelector('input[name="seconds-bar-radio"][id="'.concat(clockConfig.secondsBarVis, '"]')).checked = true;
    }

    // Update fontConfig settings
    var fontConfig = importedSettings.fontConfig;
    font.familysel.value = fontConfig.fontFamily;
    document.querySelector('input[name="font-style-radio"][id="'.concat(fontConfig.fontStyle, '"]')).checked = true;
    document.querySelector('input[name="font-weight-radio"][id="'.concat(fontConfig.fontWeight, '"]')).checked = true;
    font.sizesel.value = fontConfig.fontSize;
    font.shadowrange.value = fontConfig.dropShadow;

    // Update colorTheme settings
    var colorTheme = importedSettings.colorTheme;
    document.querySelector('input[name="color-mode-radio"][id="'.concat(colorTheme.colorMode, '"]')).checked = true;
    if (colorTheme.colorMode === 'solidmode') {
        document.querySelector('input[name="preset-color-radio"][data-color="'.concat(colorTheme.solidColor, '"]')).checked = true;
        document.querySelector('input[name="text-color-override-radio"][id="'.concat(colorTheme.textColorMode, '"]')).checked = true;
        if (colorTheme.textColorMode === 'tcovO') {
            menu.textcolorinput.value = colorTheme.textColorValue;
        }
    }
    if (colorTheme.colorMode === 'imgmode') {
        document.body.style.backgroundImage = colorTheme.bgImage;
        menu.textcolorinput.value = colorTheme.textColorValue; // Assuming textColorMode was already set to 'tcovO'
        menu.imagesizeselect.value = colorTheme.bgImageSize;
    }

    // Trigger change events for updated elements
    document.querySelector('input[name="clock-mode-radio"][id="'.concat(clockConfig.clockMode, '"]')).dispatchEvent(new Event('change'));
    menu.timeMethodSelect.dispatchEvent(new Event('change'));
    document.querySelector('input[name="seconds-vis-radio"][id="'.concat(clockConfig.secondsVis, '"]')).dispatchEvent(new Event('change'));
    menu.dateformselect.dispatchEvent(new Event('change'));
    document.querySelector('input[name="date-position-radio"][id="'.concat(clockConfig.dateAlign, '"]')).dispatchEvent(new Event('change'));
    document.querySelector('input[name="border-type-radio"][id="'.concat(clockConfig.borderMode, '"]')).dispatchEvent(new Event('change'));
    menu.borderstyleselect.dispatchEvent(new Event('change'));
    document.querySelector('input[name="seconds-bar-radio"][id="'.concat(clockConfig.secondsBarVis, '"]')).dispatchEvent(new Event('change'));
    font.familysel.dispatchEvent(new Event('change'));
    document.querySelector('input[name="font-style-radio"][id="'.concat(fontConfig.fontStyle, '"]')).dispatchEvent(new Event('change'));
    document.querySelector('input[name="font-weight-radio"][id="'.concat(fontConfig.fontWeight, '"]')).dispatchEvent(new Event('change'));
    font.sizesel.dispatchEvent(new Event('change'));
    font.shadowrange.dispatchEvent(new Event('input'));
    stopColorFade();
    document.querySelector('input[name="color-mode-radio"][id="'.concat(colorTheme.colorMode, '"]')).dispatchEvent(new Event('change'));
    if (colorTheme.colorMode === 'solidmode') {
        document.querySelector('input[name="preset-color-radio"]:checked').dispatchEvent(new Event('change'));
        document.querySelector('input[name="text-color-override-radio"]:checked').dispatchEvent(new Event('change'));
        if (colorTheme.textColorMode === 'tcovO') {
            menu.textcolorinput.dispatchEvent(new Event('input'));
        }
    }
    if (colorTheme.colorMode === 'imgmode') {
        menu.textcolorinput.dispatchEvent(new Event('input'));
        menu.imagesizeselect.dispatchEvent(new Event('change'));
    }
}
function handleValidationFailure(errorDetails) {
    var errorMsg = {
        'missing': 'Missing subkeys: '.concat(errorDetails.subkey),
        'invalid': 'Invalid value of '.concat(errorDetails.subkey, ': ').concat(errorDetails.value),
        'incomp': 'Incompatible values of '.concat(errorDetails.subkey, ': ').concat(errorDetails.value)
    };
    var errorMessage = errorMsg[''.concat(errorDetails.type)] || 'Unknown validation failure';
    console.error('ERROR - '.concat(errorMessage));
    alert('Error loading settings from imported file.\n\n'.concat(errorMessage, '\n\nIf this is a version error, please export a new settings file as settings may have been updated! If you need help, please contact me on Twitter @iKarTehFox'));
}

// Value constraints
var valid = {
    CM: ['cmo12', 'cmo24'],
    CD: ['binary', 'octal', 'decimal', 'hexa', 'emoji', 'roman', 'words'],
    SV: ['sviD', 'sviN'],
    DF: ['D', 'DD', 'DDD', 'DDDD', ''],
    DA: ['dpoL', 'dpoC', 'dpoR'],
    BM: ['btyD', 'btyR', 'btyB'],
    BS: ['solid', 'dashed', 'dotted', 'double'],
    SB: ['', 'sbaB', 'sbaN'],
    FF: ['', 'Lato', 'Montserrat', 'Open Sans', 'Oswald', 'Poppins', 'Roboto', 'Tektur', 'Ubuntu', 'Ubuntu Mono', 'Dancing Script', 'Merriweather', 'Nanum Brush Script', 'Pangolin'],
    FS: ['fstR', 'fstI'],
    FW: ['fweL', 'fweN', 'fweB'],
    FZ: ['6vw', '8vw', '10vw', '12vw', '14vw', '18vw'],
    DS: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    CMo: ['fademode', 'solidmode', 'imgmode'],
    SC: ['#FF0000', '#FFA500', '#FFFF00', '#00FF00', '#0000FF', '#FF00FF', '#FFFFFF', '#808080', '#000000', '#F2B5D4', '#C2E0E9', '#E1D5E7', '#B0E0E6', '#F7D5AA', '#D5E8D4', '#92A8D1', '#E6AF75', '#D9B5A5', '#9AC1B7', '#D0B9C3', '#C4B7D9', '#D72C6F', '#227FBF', '#7E3F9D', '#367F89', '#FF713F', '#549F55', '#2B4771', '#C55324', '#954A3E', '#457E70', '#8B2C5A', '#7C5793'],
    TCM: ['tcovD', 'tcovO'],
    BIS: ['', 'auto', 'cover', 'stretch'],
    Ver: [5, 6]
};
function containsValue(array, value) {
    if (menu.debugcheckbox.checked) {console.log("DEBUG - Checking if array ".concat(array, " contains value: ").concat(value));}
    return array.includes(value);
}
function verifySettingsJSON(jsonData) {
    var requiredKeys = ['clockConfig', 'fontConfig', 'colorTheme', 'version'];

    // Check if all required keys are present in the JSON object
    var missingKeys = requiredKeys.filter(function (key) {
        return !(key in jsonData);
    });
    if (missingKeys.length > 0) {
        return {
            type: 'missing',
            subkey: missingKeys.join(', '),
            value: ''
        };
    }

    // Perform validation for the "version" key
    var version = jsonData.version;
    if (!containsValue(valid.Ver, version)) {
        return {
            type: 'invalid',
            subkey: 'version',
            value: version
        };
    }

    // Perform validation for the "clockConfig" subkeys
    var clockConfig = jsonData.clockConfig;
    if (!containsValue(valid.CM, clockConfig.clockMode)) {
        return {
            type: 'invalid',
            subkey: 'clockMode',
            value: clockConfig.clockMode
        };
    }
    if (!containsValue(valid.CD, clockConfig.clockDisplay)) {
        return {
            type: 'invalid',
            subkey: 'clockDisplay',
            value: clockConfig.clockDisplay
        };
    }
    if (!containsValue(valid.SV, clockConfig.secondsVis)) {
        return {
            type: 'invalid',
            subkey: 'secondsVis',
            value: clockConfig.secondsVis
        };
    }
    if (!containsValue(valid.DF, clockConfig.dateFormat)) {
        return {
            type: 'invalid',
            subkey: 'dateFormat',
            value: clockConfig.dateFormat
        };
    }
    if (!containsValue(valid.DA, clockConfig.dateAlign)) {
        return {
            type: 'invalid',
            subkey: 'dateAlign',
            value: clockConfig.dateAlign
        };
    }
    if (!containsValue(valid.BM, clockConfig.borderMode)) {
        return {
            type: 'invalid',
            subkey: 'borderMode',
            value: clockConfig.borderMode
        };
    }
    if (!containsValue(valid.BS, clockConfig.borderStyle)) {
        return {
            type: 'invalid',
            subkey: 'borderStyle',
            value: clockConfig.borderStyle
        };
    }
    if (!containsValue(valid.SB, clockConfig.secondsBarVis)) {
        return {
            type: 'invalid',
            subkey: 'secondsBarVis',
            value: clockConfig.secondsBarVis
        };
    }
    if ((clockConfig.borderMode === 'btyB' || clockConfig.borderMode === 'btyR') && clockConfig.secondsBarVis === 'sbaB') {
        return {
            type: 'invalid',
            subkey: 'borderMode, secondsBarVis',
            value: ''.concat(clockConfig.borderMode, ', ').concat(clockConfig.secondsBarVis)
        };
    }

    // Perform validation for the "fontConfig" subkeys
    var fontConfig = jsonData.fontConfig;
    if (!containsValue(valid.FF, fontConfig.fontFamily)) {
        return {
            type: 'invalid',
            subkey: 'fontFamily',
            value: fontConfig.fontFamily
        };
    }
    if (!containsValue(valid.FS, fontConfig.fontStyle)) {
        return {
            type: 'invalid',
            subkey: 'fontStyle',
            value: fontConfig.fontStyle
        };
    }
    if (!containsValue(valid.FW, fontConfig.fontWeight)) {
        return {
            type: 'invalid',
            subkey: 'fontWeight',
            value: fontConfig.fontWeight
        };
    }
    if (!containsValue(valid.FZ, fontConfig.fontSize)) {
        return {
            type: 'invalid',
            subkey: 'fontSize',
            value: fontConfig.fontSize
        };
    }
    if (!containsValue(valid.DS, fontConfig.dropShadow)) {
        return {
            type: 'invalid',
            subkey: 'dropShadow',
            value: fontConfig.dropShadow
        };
    }

    // Perform validation for the "colorTheme" subkeys
    var colorTheme = jsonData.colorTheme;
    if (!containsValue(valid.CMo, colorTheme.colorMode)) {
        return {
            type: 'invalid',
            subkey: 'colorMode',
            value: colorTheme.colorMode
        };
    }
    if (colorTheme.colorMode === 'solidmode' && !containsValue(valid.SC, colorTheme.solidColor)) {
        return {
            type: 'invalid',
            subkey: 'solidColor',
            value: colorTheme.solidColor
        };
    }
    if (!containsValue(valid.TCM, colorTheme.textColorMode)) {
        return {
            type: 'invalid',
            subkey: 'textColorMode',
            value: colorTheme.textColorMode
        };
    }
    if (colorTheme.colorMode === 'fademode' && colorTheme.textColorMode === 'tcovO' || colorTheme.colorMode === 'imgmode' && colorTheme.textColorMode === 'tcovD') {
        return {
            type: 'incomp',
            subkey: 'colorMode, textColorMode',
            value: ''.concat(colorTheme.colorMode, ', ').concat(colorTheme.textColorMode)
        };
    }
    if (!containsValue(valid.BIS, colorTheme.bgImageSize)) {
        return {
            type: 'invalid',
            subkey: 'bgImageSize',
            value: colorTheme.bgImageSize
        };
    }
    if (colorTheme.bgImage && !colorTheme.bgImage.startsWith('url("data:image')) {
        return {
            type: 'invalid',
            subkey: 'bgImage',
            value: 'Value must be type "data:image/*"'
        };
    }
    return true;
}