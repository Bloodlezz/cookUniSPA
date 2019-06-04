const requester = require('../utils/requester');

module.exports = (() => {

    function getAll() {
        return requester.get('appdata', 'recipes?sort={"_kmd.ect": -1}', 'kinvey');
    }

    function getOne(id) {
        return requester.get('appdata', `recipes/${id}`, 'kinvey');
    }

    function addRecipe(recipeData) {
        return requester.post('appdata', 'recipes', 'kinvey', recipeData);
    }

    function editRecipe(recipeData) {
        return requester.update('appdata', `recipes/${recipeData._id}`, 'kinvey', recipeData);
    }

    function removeRecipe(id) {
        return requester.remove('appdata', `recipes/${id}`, 'kinvey');
    }

    return {
        getAll,
        getOne,
        addRecipe,
        editRecipe,
        removeRecipe
    }

})();