(function ($) {
  $('body.login-view').on('touchstart click', function () {
    window.location = '/auth/facebook/'
  });

  if ($('body.team-waiting-a').length) {
    var interval = setInterval(function () {
      $.getJSON(window.location.pathname + '.json', function (data) {
        if (data.all === undefined) {
          var $list = $('ul.list').empty();
          for (var i = 0, l = data.numberofMembers; i < l; i++) {
            if (typeof data.players[i] !== 'undefined') {
              $list.append('<li>' + data.players[i].displayName + '</li>');
            } else {
              $list.append('<li>Waiting on player ' + (i + 1) + '</li>');
            }
          }
        } else {
          clearInterval(interval);
          window.location = '/team/' + data.id + '/mission/' + data.mission + '/' + data.task;
        }
      });
    }, 1000);
  }

  if ($('body.team-waiting-b').length) {
    var interval = setInterval(function () {
      $.getJSON(window.location.pathname + '.json', function (data) {
        if (data.all === undefined) {
          var $list = $('ul.list').empty();
          for (var i = 0, l = data.numberofMembers; i < l; i++) {
            if (typeof data.players[i] !== 'undefined') {
              $list.append('<li>' + data.players[i].displayName + '<span class="count' + (data.completed[data.players[i]._id] ? 'green' : 'red') + '">' + (data.completed[data.players[i]._id] ? 'Yes!' : 'No!') + '</span></li>');
            } else {
              $list.append('<li>Waiting on player ' + (i + 1) + '</li>');
            }
          }
        } else {
          clearInterval(interval);
          window.location = '/team/' + data.id + '/mission/' + data.mission + '/' + data.task;
        }
      });
    }, 1000);
  }

  if ($('body.shake').length) {
    window.addEventListener('shake', function () {
      $('body.shake').find('form').submit();
    }, false);
  }

})(window.jQuery);