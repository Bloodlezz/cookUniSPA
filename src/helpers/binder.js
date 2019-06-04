const storage = require('../utils/storage');

module.exports = (() => {

    function bindFormToObj(sammyObj) {
        return Object.getOwnPropertyNames(sammyObj)
            .reduce((acc, cur) => {
                acc[cur] = sammyObj[cur];

                return acc;
            }, {});
    }

    function bindPartials(context, extraPartialsObj) {
        context.isGuest = storage.isGuest();
        context.firstName = storage.getData('firstName');
        context.lastName = storage.getData('lastName');

        let partials = {
            header: 'views/common/header.hbs',
            footer: 'views/common/footer.hbs'
        };

        if (extraPartialsObj) {
            for (let key in extraPartialsObj) {
                partials[key] = extraPartialsObj[key];
            }
        }

        return context.loadPartials(partials)
    }

    return {
        bindFormToObj,
        bindPartials
    }
})();