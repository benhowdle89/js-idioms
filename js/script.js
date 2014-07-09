(function() {

    var form = $('#mc-embedded-subscribe-form');
    var errorEl = form.find('#mce-error-response');
    var successEl = form.find('#mce-success-response');

    function register($form) {
        $.ajax({
            type: $form.attr('method'),
            url: $form.attr('action') + '&c=?',
            data: $form.serialize(),
            cache: false,
            dataType: 'jsonp',
            contentType: "application/json; charset=utf-8",
            error: function(err) {
                alert("Could not connect to the registration server. Please try again later.");
            },
            success: function(data) {
                if (data.result != "success") {
                    errorEl.html(data.msg).show();
                } else {
                    form.find('input[type="email"]').add('.button').slideUp();
                    $('.subscribe p').hide();
                    successEl.html('Splendid! You should receive a confirmation email shortly.').show();
                }
            }
        });
    }

    form.on('submit', function(e){
        e.preventDefault();
        var email = $(this).find('input[type="email"]');
        if(!email.val() || email.val().indexOf('@') == -1){
            return errorEl.html('Invalid email address').show();
        }
        errorEl.hide();
        register($(this));
    });

})();