var Doris = require('../lib/doris');

module.exports = function (app) {
  // GET: /teams/create
  app.get('/teams/create', app.ensureAuthenticated, function (req, res) {
    res.render('teams/create');
  });

  // POST: /teams/create
  app.post('/teams/create', app.ensureAuthenticated, function (req, res) {
    Doris.addTeam({
      name: req.body.team_name,
      numberofMembers: req.body.team_count,
      membersOnTask: 0,
      points: 0,
      bounsPoints: 0
    }, function (err, team) {
      // console.log(team);
      Doris.addUserToTeam(req.session.passport.user._id, ('' + team._id), function (err, user) {
        res.redirect('/team/' + team._id + '/waiting');
      });
    });
  });

  // GET: /teams/join
  app.get('/teams/join', app.ensureAuthenticated, function (req, res) {
    res.render('teams/join');
  });

  // POST: /teams/join
  app.post('/teams/join', app.ensureAuthenticated, function (req, res) {

  });
};