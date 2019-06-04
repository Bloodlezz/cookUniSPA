const storage = require('../utils/storage');

module.exports = (() => {

    function validateFormData(dataObj, formName) {
        storage.saveAsJson('validator', {});

        let formsValidation = {
            register: regLoginValidation,
            login: regLoginValidation,
            create: createEditValidation,
            edit: createEditValidation
        };

        function regLoginValidation(dataObj, key) {
            let currentInput = $(`[name=${key}]`);

            switch (key) {
                case 'firstName':
                case 'lastName':
                    const nameRegex = RegExp('^[A-Za-z]{2,}$');
                    nameRegex.test(dataObj[key])
                        ? validInput(currentInput)
                        : invalidInput(currentInput, 'Field must contains 2 or more latin letters!');
                    break;

                case 'username':
                    const usernameRegex = RegExp('^[A-Za-z]{3,}$');
                    usernameRegex.test(dataObj[key])
                        ? validInput(currentInput)
                        : invalidInput(currentInput, 'Field must contains 3 or more latin letters!');
                    break;

                case 'password':
                case 'repeatPassword':
                    const passwordRegex = RegExp('^[A-Za-z0-9]{6,}$');
                    passwordRegex.test(dataObj[key])
                        ? validInput(currentInput)
                        : invalidInput(currentInput, 'Field must contains 6 or more latin letters and digits!');
                    break;
            }
        }

        function createEditValidation(dataObj, key) {
            let currentInput = $(`[name=${key}]`);

            switch (key) {
                case 'meal':
                    if (4 <= dataObj[key].length) {
                        validInput(currentInput)
                    } else {
                        invalidInput(currentInput, 'Field must contains 4 or more latin letters!');
                    }
                    break;

                case 'ingredients':
                    const ingArray = dataObj[key]
                        .split(',')
                        .filter(i => i !== ' ' && i !== '')
                        .map(i => i.trim());
                    ingArray.length >= 2
                        ? validInput(currentInput)
                        : invalidInput(currentInput, 'At least 2 ingredients required!');
                    break;

                case 'prepMethod':
                case 'description':
                    const regexPattern = RegExp('.{10,}');
                    regexPattern.test(dataObj[key])
                        ? validInput(currentInput)
                        : invalidInput(currentInput, 'Field must contains 10 or more latin letters!');
                    break;

                case 'foodImageURL':
                    const httpRegex = RegExp('^http://?.+$');
                    const httpsRegex = RegExp('^https://?.+$');
                    if (httpRegex.test(dataObj[key]) || httpsRegex.test(dataObj[key])) {
                        validInput(currentInput);
                    } else {
                        invalidInput(currentInput, 'Invalid image URL!');
                    }
                    break;

                case 'category':
                    if (dataObj[key] !== 'Select category...') {
                        validInput(currentInput);
                    } else {
                        invalidInput(currentInput, 'Please choose category!');
                    }
                    break;
            }
        }

        for (let key in dataObj) {
            formsValidation[formName](dataObj, key);
        }
    }

    function isFormValid() {
        const formValidations = storage.getJson('validator');
        return !Object.values(formValidations).includes('invalid');
    }

    async function validInput(jqueryElement) {
        const inputName = jqueryElement.attr('name');
        storage.saveToValidator(inputName, 'valid');
        await $(`#${inputName}`)
            .hide()
            .remove();

        jqueryElement.removeClass('is-invalid');
        jqueryElement.addClass('is-valid mb-4');
    }

    async function invalidInput(jqueryElement, message) {
        const inputName = jqueryElement.attr('name');
        storage.saveToValidator(inputName, 'invalid');

        await $(`#${inputName}`).remove();
        const errorDiv = $(`<div id="${inputName}" class="feedback text-danger mb-4">${message}</div>`);

        await jqueryElement.removeClass('mb-4');
        await jqueryElement.addClass('is-invalid');
        await jqueryElement.after(errorDiv);
        await errorDiv.show('slow');
    }

    function escapeSpecialChars(dataObj, excludeArr) {
        let result = {};

        function escape(string) {
            let escape = $('<p></p>');
            escape.text(string);

            return escape.text();
        }

        for (let key in dataObj) {
            if (excludeArr.includes(key)) {
                result[key] = dataObj[key];
            } else {
                result[key] = escape(dataObj[key]);
            }
        }

        return result;
    }

    return {
        validateFormData,
        isFormValid,
        escapeSpecialChars
    }
})();