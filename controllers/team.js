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
                        task: task._id,
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
                                  //res.redirect('/team/' + req.params.id + '/mission/' + task.type + '/' + task._id);
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
      Doris.Task.findById(req.params.task, function (err, task) {
        res.render('team/mission/' + req.params.num, {
          id: req.params.id,
          taskType: req.params.num,
          task: task
        });
      });
    } else {
      res.render('team/mission-missing');
    }
  });

  // GET: /team/:id/mission/:num/play
  app.get('/team/:id/mission/:num/play/:task', app.ensureAuthenticated, function (req, res) {
    if (require('fs').existsSync(__dirname + '/../views/team/mission/' + req.params.num + '.play.html')) {
      Doris.saveLastTask(req.params.id, req.params.task, function (err, team) {
        Doris.addMission(req.params.task, req.session.passport.user._id, function (err, mission) {
          Doris.Task.findById(req.params.task, function (err, task) {
            res.render('team/mission/' + req.params.num + '.play.html', {
              id: req.params.id,
              taskType: req.params.num,
              task: task
            });
          });
        });
      });
    } else {
      res.render('/error');
    }
  });

  // POST: /team/:id/mission/:num/play
  app.post('/team/:id/mission/:num/play/:task', app.ensureAuthenticated, function (req, res) {
    // (Math.round(Math.random())
    var vailed = req.body.mission_key === 'jkagekj090' || req.body.mission_key === 'shake';
    res.redirect(getCompletedOrFailedUrl(req, vailed, req.params.task));
  });

  // GET: /team/:id/mission/:num/completed/:task
  app.get('/team/:id/mission/:num/completed/:task', app.ensureAuthenticated, function (req, res) {
    Doris.saveMission(req.params.task, req.session.passport.user._id, {}, function (err, _) {
      Doris.getNextMission(req.params.id, function (err, task) {
        res.render('team/mission/completed', {
          waitingUrl: '/team/' + req.params.id + '/mission/' + task.type + '/waiting/' + req.params.task,
          id: req.params.id
        });
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

  // GET: /team/:id/waiting.json
  app.get('/team/:id/mission/:num/waiting/:task.json', app.ensureAuthenticated, function (req, res) {
    Doris.getTeam(req.params.id, function (err, team) {
      Doris.users(function (err, users) {
        var players = [];
        var _completed = {};

        if (users.length) {
          for (var i = 0, l = users.length; i < l; i++) {
            if (users[i].teamId === req.params.id) {
              players.push(users[i]);
              Doris.missionCompletedUser(
                req.params.task,
                req.params.id,
                req.session.passport.user._id,
                function (err, completed) {
                  _completed[req.session.passport.user._id] = completed;
                  if (users.length === i) {
                    Doris.getNextMission(req.params.id, function (err, task) {
                      if (Object.keys(players).length === team.numberofMembers) {
                        return res.json({
                          teamName: team.name,
                          players: players,
                          numberofMembers: team.numberofMembers,
                          id: req.params.id,
                          mission: task.type,
                          task: task._id,
                          completed: _completed
                        });
                      } else {
                        return res.json({
                          all: true,
                          id: req.params.id,
                          mission: task.type,
                          task: task._id,
                          completed: _completed
                        });
                      }
                    });
                  }
                });
              }
            }
          } else {
            Doris.getNextMission(req.params.id, function (err, task) {
              if (players.length < team.numberofMembers) {
                res.json({
                  teamName: team.name,
                  players: players,
                  numberofMembers: team.numberofMembers,
                  id: req.params.id,
                  mission: task.type,
                  task: task._id,
                  completed: _completed
                });
              } else {
                res.json({
                  all: true,
                  id: req.params.id,
                  mission: task.type,
                  task: task._id,
                  completed: _completed
                });
              }
            });
        }
      });
    });
  });

  // GET: /team/:id/mission/:num/failed
  app.get('/team/:id/mission/:num/waiting/:task', app.ensureAuthenticated, function (req, res) {
    Doris.getTeam(req.params.id, function (err, team) {
      Doris.users(function (err, users) {
        var players = [];
        var _completed = {};

        if (users.length) {
          for (var i = 0, l = users.length; i < l; i++) {
            if (users[i].teamId === req.params.id) {
              players.push(users[i]);
              Doris.missionCompletedUser(
                req.params.task,
                req.params.id,
                req.session.passport.user._id,
                function (err, completed) {
                  _completed[req.session.passport.user._id] = completed;
                  if (users.length === i) {
                    Doris.getNextMission(req.params.id, function (err, task) {
                      if (Object.keys(players).length === team.numberofMembers) {
                        res.render('team/waiting', {
                          missionCompletedWaiting: true,
                          teamName: team.name,
                          players: players,
                          numberofMembers: team.numberofMembers,
                          id: req.params.id,
                          mission: task.type,
                          task: task._id,
                          taskType: req.params.num,
                          completed: _completed
                        });
                      } else {
                        res.render('team/waiting', {
                          missionCompletedWaiting: true,
                          id: req.params.id,
                          mission: task.type,
                          task: task._id,
                          taskType: req.params.num,
                          completed: _completed
                        });
                      }
                    });
                  }
                });
              }
            }
          } else {
            Doris.getNextMission(req.params.id, function (err, task) {
              if (players.length < team.numberofMembers) {
                res.render('team/waiting', {
                  missionCompletedWaiting: true,
                  teamName: team.name,
                  players: players,
                  numberofMembers: team.numberofMembers,
                  id: req.params.id,
                  mission: task.type,
                  task: task._id,
                  taskType: req.params.num,
                  completed: _completed
                });
              } else {
                res.render('team/waiting', {
                  missionCompletedWaiting: true,
                  id: req.params.id,
                  mission: task.type,
                  task: task._id,
                  taskType: req.params.num,
                  completed: _completed
                });
              }
            });
        }
      });
    });
  });

};