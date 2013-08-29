module.exports = function (app) {

  function getCompletedOrFailedUrl (req, completed) {
    return '/team/mission/' + req.params.num + '/' + (completed ? 'completed' : 'failed');
  }


  // GET: /team/play
  app.get('/team/waiting', app.ensureAuthenticated, function (req, res) {
    res.render('team/waiting');
  });

  // GET: /team/mission/:num
  app.get('/team/mission/:num', app.ensureAuthenticated, function (req, res) {
    if (require('fs').existsSync(__dirname + '/../views/team/mission/' + req.params.num + '.html')) {
      res.render('team/mission/' + req.params.num);
    } else {
      res.render('team/mission-missing');
    }
  });

  // GET: /team/mission/:num
  app.get('/team/mission/:num/play', app.ensureAuthenticated, function (req, res) {
    if (require('fs').existsSync(__dirname + '/../views/team/mission/' + req.params.num + '.play.html')) {
      res.render('team/mission/' + req.params.num + '.play.html');
    } else {
      res.render('/error');
    }
  });

  // POST: /team/mission/:num/play
  app.post('/team/mission/:num/play', app.ensureAuthenticated, function (req, res) {
    var vailed = req.body.mission_key === (Math.round(Math.random()) ? 'jkagekj090' : '20+20+30+3');
    res.redirect(getCompletedOrFailedUrl(req, vailed));
  });

  // GET: /team/mission/:num/completed
  app.get('/team/mission/:num/completed', app.ensureAuthenticated, function (req, res) {
    res.render('team/mission/completed', {
      waitingUrl: '/team/mission/' + req.params.num + '/waiting'
    });
  });

  // GET: /team/mission/:num/failed
  app.get('/team/mission/:num/failed', app.ensureAuthenticated, function (req, res) {
    res.render('team/mission/failed', {
      nextMissionUrl: '/team/mission/' + req.params.num
    });
  });

  // GET: /team/mission/:num/failed
  app.get('/team/mission/:num/waiting', app.ensureAuthenticated, function (req, res) {
    res.render('team/waiting', {
      missionCompletedWaiting: true,
      mission: 1,
      nextMissionUrl: '/team/mission/' + (parseInt(req.params.num) + 1)
    });
  });
};