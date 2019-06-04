module.exports = (() => {
    const appKey = '';

    function saveSession(userInfo) {
        sessionStorage.setItem('authToken', userInfo._kmd.authtoken);
        sessionStorage.setItem('userId', userInfo._id);
        sessionStorage.setItem('firstName', userInfo.firstName);
        sessionStorage.setItem('lastName', userInfo.lastName);
        sessionStorage.removeItem('validator');
    }

    function clearSession() {
        sessionStorage.clear();
    }

    function saveData(key, value) {
        sessionStorage.setItem(`${appKey}${key}`, value)
    }

    function getData(key) {
        return sessionStorage.getItem(`${appKey}${key}`);
    }

    function saveAsJson(key, data) {
        sessionStorage.setItem(`${appKey}${key}`, JSON.stringify(data));
    }

    function getJson(key) {
        return JSON.parse(sessionStorage.getItem(`${appKey}${key}`));
    }

    function deleteData(key) {
        sessionStorage.removeItem(`${appKey}${key}`);
    }

    function saveToValidator(key, value) {
        let validator = getJson('validator') || {};
        validator[key] = value;
        saveAsJson('validator', validator);
    }

    function isGuest() {
        return sessionStorage.getItem('authToken') === null
            || sessionStorage.getItem('authToken') === undefined
    }

    return {
        saveData,
        getData,
        saveSession,
        clearSession,
        saveAsJson,
        saveToValidator,
        getJson,
        deleteData,
        isGuest,
        appKey
    }

})();