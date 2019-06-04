const Handlebars = require('../../node_modules/handlebars/dist/handlebars.min');
const storage = require('../utils/storage');

module.exports = (() => {

    function isSelected() {
        Handlebars.registerHelper('isSelected', function (value, text) {
            return value === text ? 'selected' : '';
        });
    }

    function isAuthor() {
        Handlebars.registerHelper('isAuthor', function (creatorId) {
            return storage.getData('userId') === creatorId;
        });
    }

    function ingredientsAsText () {
        Handlebars.registerHelper('ingredientsAsText', function (ingredients) {
            return ingredients.join(' ,');
        });
    }

    function isUserInLikes() {
        Handlebars.registerHelper('isUserInLikes', function (likes) {
            return likes.indexOf(storage.getData('userId')) !== -1;
        });
    }

    function likesCounter() {
        Handlebars.registerHelper('likesCounter', function (likes) {
            return likes.length;
        });
    }

    return {
        isSelected,
        isAuthor,
        ingredientsAsText,
        isUserInLikes,
        likesCounter
    }
})();