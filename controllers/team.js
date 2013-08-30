var Doris = require('../lib/doris');

module.exports = function (app) {

  function getCompletedOrFailedUrl (req, completed, task) {
    return '/team/' + req.params.id + '/mission/' + req.params.num + '/' + (completed ? 'completed' : 'failed') + '/' + task;
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

        Doris.getNextMission(req.params.id, function (err, task) {
          if (!err) {
            Doris.teamCompletedTask(req.params.id, ('' + task._id), function (err, completed, team) {
              if (completed) {
                Doris.getNextMissionInArray(req.params.id, ('' + task._id), completed, function (err, task) {
                  if (task !== undefined) {
                    if (players.length < team.numberofMembers) {
                      res.render('team/waiting', {
                        teamName: team.name,
                        players: players,
                        numberofMembers: team.numberofMembers,
                        id : req.params.id,
                        taskType: task.type,
                        task: task._id
                      });
                    } else {
                      res.redirect('/team/' + req.params.id + '/mission/' + task.type + '/' + task._id);
                    }
                  } else {
                    console.log('getNextMissionInArray');
                    res.render('team/mission-missing');
                  }
                });
              } else {
                process.nextTick(function () {
                  if (team !== undefined) {
                    Doris.tasks(function (err, tasks) {
                      if (tasks !== undefined && tasks.length) {
                        task = tasks[0];
                        Doris.saveLastTask(('' + team._id), ('' + task._id), function (err, team) {
                          if (!err) {
                            Doris.Task.findById(('' + task._id), function (err, task) {
                              if (task !== undefined) {
                                if (players.length < team.numberofMembers) {
                                  res.render('team/waiting', {
                                    teamName: team.name,
                                    players: players,
                                    numberofMembers: team.numberofMembers,
                                    id : req.params.id,
                                    taskType: task.type,
                                    task: task._id
                                  });
                                } else {
                                  res.redirect('/team/' + req.params.id + '/mission/' + task.type + '/' + task._id);
                                }
                              } else {
                                console.log('Task.findById');
                                res.render('team/mission-missing');
                              }
                            });
                          } else {
                            console.log('Task.findById');
                            console.log(err);
                            res.render('team/mission-missing');
                          }
                        });
                      } else {
                        console.log('Doris.tasks');
                        console.log(err);
                        res.redirect('/error');
                      }
                    });
                  } else {
                    console.log('Team.findById');
                    console.log(err);
                    res.redirect('/error');
                  }
                });
              }
            });
          } else {
            console.log('getNextMission');
            res.redirect('/error');
          }
        });
      });
    });
  });

  // GET: /team/:id/waiting.json
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
  app.get('/team/:id/mission/:num/:task', app.ensureAuthenticated, function (req, res) {
    if (require('fs').existsSync(__dirname + '/../views/team/mission/' + req.params.num + '.html')) {
      res.render('team/mission/' + req.params.num, {
        id: req.params.id,
        taskType: req.params.num,
        task: req.params.task
      });
    } else {
      res.render('team/mission-missing');
    }
  });

  // GET: /team/:id/mission/:num/play
  app.get('/team/:id/mission/:num/play/:task', app.ensureAuthenticated, function (req, res) {
    if (require('fs').existsSync(__dirname + '/../views/team/mission/' + req.params.num + '.play.html')) {
      Doris.saveLastTask(req.params.id, req.params.task, function (err, team) {
        res.render('team/mission/' + req.params.num + '.play.html', {
          id: req.params.id,
          taskType: req.params.num,
          task: req.params.task
        });
      });
    } else {
      res.render('/error');
    }
  });

  // POST: /team/:id/mission/:num/play
  app.post('/team/:id/mission/:num/play/:task', app.ensureAuthenticated, function (req, res) {
    // (Math.round(Math.random())
    var vailed = false;
    if (req.body.mission_type === 1) {
      vailed = req.body.mission_key === 'jkagekj090';
    } else if (req.body.mission_type === 2) {
      vailed = req.body.mission_key === 'shake';
    }
    res.redirect(getCompletedOrFailedUrl(req, vailed, req.params.task));
  });

  // GET: /team/:id/mission/:num/completed/:task
  app.get('/team/:id/mission/:num/completed/:task', app.ensureAuthenticated, function (req, res) {
    Doris.completeMission(req.params.task, req.session.passport.user._id, {
      completed: true
    }, function (err, _) {
      res.render('team/mission/completed', {
        waitingUrl: '/team/' + req.params.id + '/mission/' + req.params.num + '/waiting',
        id: req.params.id
      });
    });
  });

  // GET: /team/:id/mission/:num/failed/:task
  app.get('/team/:id/mission/:num/failed/:task', app.ensureAuthenticated, function (req, res) {
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