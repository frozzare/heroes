var Doris = require('../lib/doris');

module.exports = function (app) {

  function getCompletedOrFailedUrl (req, completed) {
    return '/team/' + req.params.id + '/mission/' + req.params.num + '/' + (completed ? 'completed' : 'failed');
  }

  // GET: /team/:id
  app.get('/team/:id', app.ensureAuthenticated, function (req, res) {
    res.redirect('/team/' + req.params.id + '/waiting');
  });

  // GET: /team/:id/waiting
  app.get('/team/:id/waiting', app.ensureAuthenticated, function (req, res) {
    Doris.getTeam(req.params.id, function (err, team) {
      Doris.users(function (err, users) {
        var players = [];
        for (var i = 0, l = users.length; i < l; i++) {
          if (users[i].teamId === req.params.id) {
            players.push(users[i]);
          }
        }

        if (players.length < team.numberofMembers) {
          res.render('team/waiting', {
            teamName: team.name,
            players: players,
            numberofMembers: team.numberofMembers,
            id: req.params.id
          });
        } else {
          res.redirect('/team/' + req.params.id + '/mission/' + 1);
        }
      });
    });
  });

  app.get('/team/:id/waiting.json', function (req, res) {
    Doris.getTeam(req.params.id, function (err, team) {
      Doris.users(function (err, users) {
        var players = [];

        for (var i = 0, l = users.length; i < l; i++) {
          if (users[i].teamId === req.params.id) {
            players.push(users[i]);
          }
        }

        Doris.getNextMission(req.params.id, function (err, task) {
          if (players.length < team.numberofMembers) {
            res.json({
              teamName: team.name,
              players: players,
              numberofMembers: team.numberofMembers,
              id: req.params.id,
              mission: task.type
            });
          } else {
            res.json({
              all: true,
              id: req.params.id,
              mission: task.type
            });
          }
        });
      });
    });
  });

  // GET: /team/:id/mission/:num
  app.get('/team/:id/mission/:num', app.ensureAuthenticated, function (req, res) {
    if (require('fs').existsSync(__dirname + '/../views/team/mission/' + req.params.num + '.html')) {
      res.render('team/mission/' + req.params.num, {
        id: req.params.id,
        taskType: req.params.num
      });
    } else {
      res.render('team/mission-missing');
    }
  });

  // GET: /team/:id/mission/:num
  app.get('/team/:id/mission/:num/play', app.ensureAuthenticated, function (req, res) {
    if (require('fs').existsSync(__dirname + '/../views/team/mission/' + req.params.num + '.play.html')) {
      res.render('team/mission/' + req.params.num + '.play.html', {
        id: req.params.id,
        taskType: req.params.num
      });
    } else {
      res.render('/error');
    }
  });

  // POST: /team/:id/mission/:num/play
  app.post('/team/:id/mission/:num/play', app.ensureAuthenticated, function (req, res) {
    // (Math.round(Math.random())
    var vailed = req.body.mission_key === 'jkagekj090';
    res.redirect(getCompletedOrFailedUrl(req, vailed));
  });

  // GET: /team/:id/mission/:num/completed
  app.get('/team/:id/mission/:num/completed', app.ensureAuthenticated, function (req, res) {
    res.render('team/mission/completed', {
      waitingUrl: '/team/' + req.params.id + '/mission/' + req.params.num + '/waiting',
      id: req.params.id
    });
  });

  // GET: /team/:id/mission/:num/failed
  app.get('/team/:id/mission/:num/failed', app.ensureAuthenticated, function (req, res) {
    res.render('team/mission/failed', {
      nextMissionUrl: '/team/' + req.params.id + '/mission/' + req.params.num,
      id: req.params.id
    });
  });

  // GET: /team/:id/mission/:num/failed
  app.get('/team/:id/mission/:num/waiting', app.ensureAuthenticated, function (req, res) {
    Doris.getTeamByUserId(req.sesison.passport.user._id, function (err, team) {
      res.render('team/waiting', {
        missionCompletedWaiting: true,
        mission: 1,
        nextMissionUrl: '/team/' + req.params.id + '/mission/' + (parseInt(req.params.num) + 1),
        teamName: team.name,
        id: req.params.id
      });
    });
  });
};