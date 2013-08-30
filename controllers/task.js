var Doris = require('../lib/doris');

module.exports = function (app) {

  // GET: /task/add
  app.get('/task/add', function (req, res) {
    res.render('task/add');
  });

  // GET: /task/add
  app.post('/task/add', function (req, res) {
    Doris.addTask({
      name: req.body.name,
      background: req.body.background,
      description: req.body.description,
      points: req.body.points || 4,
      bounsPoints: req.body.bonusPoints || 0,
      type: req.body.type || 0
    }, function (err, task) {
      if (!err) res.redirect('/task/add');
    });
  });

};