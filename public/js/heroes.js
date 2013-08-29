(function ($) {
  $('body.login-view').on('touchstart click', function () {
    window.location = '/auth/facebook/'
  });
})(window.jQuery);