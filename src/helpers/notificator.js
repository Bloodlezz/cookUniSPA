module.exports = (() => {

    function handleError(reason) {
        showError(reason.responseJSON.description);
    }

    function showInfo(message) {
        hideAll();
        let infoDiv = $('#info');

        infoDiv.html(message);

        infoDiv.addClass('show');
        setTimeout(function () {
            infoDiv.removeClass('show');
            infoDiv.html('');
        }, 3490);
    }

    function showError(message) {
        hideAll();
        let errorDiv = $('#error');

        if (Array.isArray(message)) {
            for (let msg of message) {
                errorDiv.append($(`<li>${msg}</li>`));
            }
        } else {
            errorDiv.html(message);
        }

        errorDiv.addClass('show');
        setTimeout(function () {
            errorDiv.removeClass('show');
            errorDiv.html('');
        }, 3490);
    }

    function showLoading() {
        const loaderWrapper = $('#loaderWrapper');

        if (loaderWrapper.hasClass('show') === false) {
            loaderWrapper.modal({
                backdrop: 'static',
                keyboard: false
            });
        }
    }

    function hideLoading() {
        setTimeout(() => {
            $('#loaderWrapper')
                .modal('hide')
                .data('bs.modal', null);

            $('div.modal-backdrop.fade.show')
                .remove();
        }, 400);
    }

    // Helper function for showInfo & showError
    function hideAll() {
        let notificationDivs = $('#info #error');

        for (let div of notificationDivs) {
            div.remove();

            if (div.id === 'info') {
                $('#loaderWrapper').after($('<div id="info" class="bg-success"></div>'));
            } else {
                $('#loaderWrapper').after($('<div id="error" class="bg-danger"></div>'));
            }
        }
    }

    return {
        handleError,
        showInfo,
        showError,
        showLoading,
        hideLoading
    }
})();