const storage = require('../utils/storage');

module.exports = (() => {
    const baseUrl = 'https://baas.kinvey.com';
    const appKey = process.env.APP_KEY;
    const appSecret = process.env.APP_SECRET;
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;

    function makeAuth(type) {
        switch (type) {
            case 'basic':
                return `Basic ${btoa(appKey + ':' + appSecret)}`;
            case 'free':
                return `Basic ${btoa(username + ':' + password)}`;
            default:
                return `Kinvey ${storage.getData('authToken')}`;
        }
    }
    
    function makeRequest(method, module, endpoint, auth, data) {
        data = data || {};

        return request = {
            method,
            url: `${baseUrl}/${module}/${appKey}/${endpoint}`,
            headers: {
                'Authorization': makeAuth(auth),
                'Content-Type': 'application/json; charset=utf-8'
            },
            data: JSON.stringify(data)
        }
    }

    function get(module, endpoint, auth) {
        return $.ajax(makeRequest('GET', module, endpoint, auth));
    }

    function post(module, endpoint, auth, data) {
        return $.ajax(makeRequest('POST', module, endpoint, auth, data));
    }

    function update(module, endpoint, auth, data) {
        return $.ajax(makeRequest('PUT', module, endpoint, auth, data));
    }

    function remove(module, endpoint, auth) {
        return $.ajax(makeRequest('DELETE', module, endpoint, auth));
    }

    return {
        get,
        post,
        update,
        remove
    };

})();