const requester = require('../utils/requester');
const storage = require('../utils/storage');

module.exports = (() => {

    function registerUser(userData) {
        return requester.post('user', '', 'basic', userData);
    }

    function loginUser(credentialsObj) {
        return requester.post('user', 'login', 'basic', credentialsObj);
    }

    function getAllUsers() {
        return requester.get('user', '', 'kinvey');
    }

    function getUserInfo(id) {
        return requester.get('user', id, 'kinvey');
    }

    function logoutUser() {
        let logoutData = {
            authToken: storage.getData('authToken')
        };

        return requester.post('user', '_logout', 'kinvey', logoutData);
    }

    return {
        registerUser,
        loginUser,
        logoutUser,
        getUserInfo,
        getAllUsers
    }
})();