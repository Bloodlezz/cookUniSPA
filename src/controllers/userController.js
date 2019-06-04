const binder = require('../helpers/binder');
const validator = require('../helpers/validator');
const notificator = require('../helpers/notificator');

const storage = require('../utils/storage');

const userModel = require('../models/userModel');

module.exports = (() => {

    function registerGet(context) {
        binder.bindPartials(context)
            .then(function () {
                this.partial('views/user/register.hbs');
            });
    }

    function registerPost(context) {
        const userData = binder.bindFormToObj(context.params);
        validator.validateFormData(userData, 'register');

        if (validator.isFormValid()) {

            if (userData.password !== userData.repeatPassword) {
                notificator.showError('Passwords don\'t match!');
            } else {
                notificator.showLoading();
                delete userData.repeatPassword;

                userModel.registerUser(userData)
                    .then((user) => {
                        notificator.hideLoading();
                        storage.saveSession(user);
                        this.redirect('#/home');
                        notificator.showInfo('Registration successful');
                    })
                    .catch(function (error) {
                        notificator.hideLoading();
                        notificator.handleError(error);
                    });
            }
        } else {
            notificator.hideLoading();
            notificator.showError('Please fill in the fields correctly!');
        }
    }

    function loginGet(context) {
        binder.bindPartials(context)
            .then(function () {
                this.partial('views/user/login.hbs');
            });
    }

    function loginPost(context) {
        const credentials = binder.bindFormToObj(context.params);
        validator.validateFormData(credentials, 'login');

        if (validator.isFormValid()) {
            notificator.showLoading();

            userModel.loginUser(credentials)
                .then((userInfo) => {
                    notificator.hideLoading();
                    storage.saveSession(userInfo);
                    this.redirect('#/home');
                    notificator.showInfo('Login successful');
                })
                .catch(function (error) {
                    notificator.hideLoading();
                    notificator.handleError(error);
                });
        } else {
            notificator.showError('Please fill in the fields correctly!');
        }
    }

    function logout() {
        notificator.showLoading();
        userModel.logoutUser()
            .then(() => {
                notificator.hideLoading();
                storage.clearSession();
                this.redirect('#/home');
                notificator.showInfo('Logout successful');
            })
    }

    return {
        registerGet,
        registerPost,
        loginGet,
        loginPost,
        logout
    }
})();