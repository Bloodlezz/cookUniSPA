const binder = require('../helpers/binder');
const validator = require('../helpers/validator');
const notificator = require('../helpers/notificator');
const hbsHelpers = require('../helpers/hbsHelpers');

const storage = require('../utils/storage');

const recipeModel = require('../models/recipeModel');

module.exports = (() => {

    function createGet(context) {
        binder.bindPartials(context)
            .then(function () {
                this.partial('views/recipe/create.hbs');
            });
    }

    function createPost(context) {
        const formData = binder.bindFormToObj(this.params);

        validator.validateFormData(formData, 'create');

        if (validator.isFormValid()) {
            notificator.showLoading();

            addCategoryImg(formData);
            processIngredients(formData);
            formData.likes = [];

            recipeModel.addRecipe(formData)
                .then(() => {
                    notificator.hideLoading();
                    this.redirect('#/home');
                    notificator.showInfo('Recipe shared successfully!');
                })
                .catch(err => {
                    notificator.hideLoading();
                    notificator.handleError(err);
                });
        } else {
            notificator.showError('Please fill in the fields correctly!');
        }
    }

    function viewGet(context) {
        // notificator.showLoading();
        const recipeId = this.params.id;

        recipeModel.getOne(recipeId)
            .then(recipe => {
                context.recipe = recipe;
                hbsHelpers.isAuthor();
                hbsHelpers.isUserInLikes();
                hbsHelpers.likesCounter();
                binder.bindPartials(context)
                    .then(function () {
                        // notificator.hideLoading();
                        this.partial('views/recipe/view.hbs');
                    });
            })
            .catch(err => {
                // notificator.hideLoading();
                this.redirect('#/');
                notificator.handleError(err);
            });
    }

    function editGet(context) {
        // notificator.showLoading();
        const recipeId = this.params.id;

        recipeModel.getOne(recipeId)
            .then(recipe => {
                context.recipe = recipe;
                hbsHelpers.ingredientsAsText();
                hbsHelpers.isSelected();
                binder.bindPartials(context)
                    .then(function () {
                        // notificator.hideLoading();
                        this.partial('views/recipe/edit.hbs');
                    });
            })
            .catch(err => {
                // notificator.hideLoading();
                this.redirect('#/');
                notificator.handleError(err);
            });
    }

    function editPost(context) {
        const recipeId = this.params.id;
        const formData = binder.bindFormToObj(this.params);

        delete formData.id;

        validator.validateFormData(formData, 'edit');

        if (validator.isFormValid()) {
            notificator.showLoading();

            recipeModel.getOne(recipeId)
                .then((currentRecipe) => {
                    formData._id = currentRecipe._id;
                    formData.likes = currentRecipe.likes;
                    addCategoryImg(formData);
                    processIngredients(formData);

                    recipeModel.editRecipe(formData)
                        .then((recipe) => {
                            notificator.hideLoading();
                            this.redirect(`#/recipe/view/${recipe._id}`);
                            notificator.showInfo('Recipe edited successfully!');
                        });
                })
                .catch(err => {
                    notificator.hideLoading();
                    notificator.handleError(err);
                });
        } else {
            notificator.showError('Please fill in the fields correctly!');
        }
    }

    function remove(context) {
        notificator.showLoading();
        let recipeId = context.params.id;

        recipeModel.removeRecipe(recipeId)
            .then(() => {
                notificator.hideLoading();
                this.redirect('#/home');
                notificator.showInfo('Your recipe was deleted.');
            })
            .catch(function (error) {
                notificator.hideLoading();
                notificator.handleError(error);
            });
    }

    function like(context) {
        notificator.showLoading();
        const recipeId = this.params.id;

        recipeModel.getOne(recipeId)
            .then(function (recipe) {
                let likeAction;
                const userId = storage.getData('userId');

                if (userId === recipe._acl.creator) {
                    notificator.hideLoading();
                    notificator.showError('Can\'t like your own recipe!');
                    return;
                }

                const updatedLikes = recipe.likes;

                if (updatedLikes.indexOf(userId) !== -1) {
                    updatedLikes.splice(updatedLikes.indexOf(userId), 1);
                    likeAction = 'Like removed.';
                } else {
                    updatedLikes.push(userId);
                    likeAction = 'Like added.';
                }

                recipe.likes = updatedLikes;

                recipeModel.editRecipe(recipe)
                    .then(() => {
                        notificator.hideLoading();
                        context.redirect(`#/recipe/view/${recipeId}`);
                        notificator.showInfo(likeAction);
                    });
            })
            .catch(err => {
                notificator.hideLoading();
                notificator.handleError(err);
            });
    }

    return {
        createGet,
        createPost,
        editGet,
        editPost,
        viewGet,
        remove,
        like
    }
})();

function addCategoryImg(recipe) {
    switch (recipe.category) {
        case 'Vegetables and legumes/beans':
            recipe.categoryImageURL = 'https://cdn.pixabay.com/photo/2017/10/09/19/29/eat-2834549__340.jpg';
            break;

        case 'Fruits':
            recipe.categoryImageURL = 'https://cdn.pixabay.com/photo/2017/06/02/18/24/fruit-2367029__340.jpg';
            break;

        case 'Grain Food':
            recipe.categoryImageURL = 'https://cdn.pixabay.com/photo/2014/12/11/02/55/corn-syrup-563796__340.jpg';
            break;

        case 'Milk, cheese, eggs and alternatives':
            recipe.categoryImageURL = 'https://image.shutterstock.com/image-photo/assorted-dairy-products-milk-yogurt-260nw-530162824.jpg';
            break;

        case 'Lean meats and poultry, fish and alternatives':
            recipe.categoryImageURL = 'https://t3.ftcdn.net/jpg/01/18/84/52/240_F_118845283_n9uWnb81tg8cG7Rf9y3McWT1DT1ZKTDx.jpg';
            break;
    }

    return recipe;
}

function processIngredients(recipe) {
    recipe.ingredients = recipe.ingredients
        .split(',')
        .map(i => i.trim())
        .filter(i => i !== '');

    return recipe;
}