const binder = require('../helpers/binder');
const notificator = require('../helpers/notificator');

const recipeModel = require('../models/recipeModel');

module.exports = (() => {

    function index(context) {
        binder.bindPartials(context)
            .then(function () {
                if (context.isGuest === false) {
                    notificator.showLoading();

                    recipeModel.getAll()
                        .then(recipes => {
                            notificator.hideLoading();
                            context.recipes = recipes;
                            this.partial('views/home/index.hbs');
                        })
                        .catch(err => {
                            notificator.hideLoading();
                            notificator.handleError(err);
                        });
                } else {
                    this.partial('views/home/index.hbs');
                }
            });
    }

    function notFound(context) {
        binder.bindPartials(context)
            .then(function () {
                this.partial('views/home/404.hbs')
            });
    }

    return {
        index,
        notFound
    }
})();