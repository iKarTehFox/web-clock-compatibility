'use strict';

// Text color override listener
var tcoO = 0;
menu.textcoloroverrideradio.forEach(function (radio) {
    radio.addEventListener('change', function () {
        if (radio.id === 'tcovD') {
            tcoO = 0;
            menu.textcolorinput.disabled = true;
            if (document.querySelector('input[name="color-mode-radio"]:checked').id === 'solidmode') {
                try {
                    document.querySelector('input[name="preset-color-radio"]:checked').dispatchEvent(new Event('change'));
                } catch (error) {
                    dtdisplay.ccontainer.style.color = '#212529';
                    dtdisplay.timebar.style.backgroundColor = '#212529';
                }
            }
        } else {
            tcoO = 1;
            menu.textcolorinput.disabled = false;
            menu.textcolorinput.dispatchEvent(new Event('input'));
        }
    });
});
menu.textcolorinput.addEventListener('input', function () {
    dtdisplay.ccontainer.style.color = this.value;
    dtdisplay.timebar.style.backgroundColor = this.value;
});

// Preset color buttons listener
menu.presetcolors.forEach(function (radio) {
    radio.addEventListener('change', function () {
        var color = radio.dataset.color;
        // Determine the luminance of the background color
        var luminance = getLuminance(color);

        // Set the text color based on the background luminance
        if (luminance > 0.62 && tcoO === 0) {
            dtdisplay.ccontainer.style.color = '#212529'; // Set black text color
            dtdisplay.timebar.style.backgroundColor = '#212529';
        } else if (tcoO === 0) {
            dtdisplay.ccontainer.style.color = '#FFF'; // Set white text color
            dtdisplay.timebar.style.backgroundColor = '#FFF';
        }
    });
});
function getLuminance(color) {
    // Assuming color is in RGB format, convert it to relative luminance
    var r = parseInt(color.substr(1, 2), 16) / 255;
    var g = parseInt(color.substr(3, 2), 16) / 255;
    var b = parseInt(color.substr(5, 2), 16) / 255;

    // Calculate the relative luminance using the sRGB color space formula
    var luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    if (menu.debugcheckbox.checked) {console.log("DEBUG - Luminance for ".concat(color, ": ").concat(luminance));}
    return luminance;
}