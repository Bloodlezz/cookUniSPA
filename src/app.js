import Sammy from '../node_modules/sammy/lib/sammy';
import '../node_modules/sammy/lib/plugins/sammy.handlebars';

const homeController = require('./controllers/homeController');
const userController = require('./controllers/userController');
const recipeController = require('./controllers/recipeController');

$(() => {
    const app = Sammy('#rooter', router);

    app.run('#/home');
});

function router() {
    this.use('Handlebars', 'hbs');

    this.route('get', '#/home', homeController.index);

    this.route('get', '#/register', userController.registerGet);
    this.route('post', '#/register', userController.registerPost);
    this.route('get', '#/login', userController.loginGet);
    this.route('post', '#/login', userController.loginPost);
    this.route('get', '#/logout', userController.logout);

    this.route('get', '#/recipe/create', recipeController.createGet);
    this.route('post', '#/recipe/create', recipeController.createPost);
    this.route('get', '#/recipe/edit/:id', recipeController.editGet);
    this.route('post', '#/recipe/edit/:id', recipeController.editPost);
    this.route('get', '#/recipe/view/:id', recipeController.viewGet);
    this.route('get', '#/recipe/remove/:id', recipeController.remove);
    this.route('post', '#/recipe/like/:id', recipeController.like);

    this.route('get', '', homeController.notFound);
}