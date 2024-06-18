'use strict';

function uploadBGImg() {
    var input = document.createElement('input');
    var bodyElement = document.body;
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', function (e) {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            var imageUrl = reader.result;
            bodyElement.style.backgroundImage = 'url(\''.concat(imageUrl, '\')');
        };
    });
    input.click();
}
menu.imagesizeselect.addEventListener('change', function () {
    var value = menu.imagesizeselect.value;
    var bodyElement = document.body;
    switch (value) {
    case 'auto':
        bodyElement.style.backgroundSize = value;
        break;
    case 'cover':
        bodyElement.style.backgroundSize = value;
        break;
    case 'stretch':
        bodyElement.style.backgroundSize = '100vw 100vh';
        break;
    default:
        console.error('ERROR - Unsupported background size value: '.concat(value));
        break;
    }
});