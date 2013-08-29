module.exports = function (app) {
  // GET: /teams/create
  app.get('/teams/create', /* ensureAuthenticated, */ function (req, res) {
    res.render('teams/create');
  });

  // POST: /teams/create
  app.post('/teams/create', /* ensureAuthenticated, */ function (req, res) {

  });

  // GET: /teams/join
  app.get('/teams/join', /* ensureAuthenticated, */ function (req, res) {
    res.render('teams/join');
  });

  // POST: /teams/join
  app.post('/teams/join', /* ensureAuthenticated, */ function (req, res) {
  });
};