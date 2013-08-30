var mongoose = require('mongoose')
  , Doris = {};

Doris.db = mongoose.createConnection('mongodb://localhost/heroes');

// Mission collection
Doris.Mission = Doris.db.model('mission', {
  taskId: String,
  userId: String,
  teamId: String,
  completed: Boolean,
  points: Number,
  bounsPoints: Number
});

// Task collection
Doris.Task = Doris.db.model('task', {
  name: String,
  background: String,
  description: String,
  points: Number,
  bounsPoints: Number,
  type: Number
});

// Team collection
Doris.Team = Doris.db.model('team', {
  name: String,
  numberofMembers: Number,
  membersOnTask: Number,
  points: Number,
  bounsPoints: Number,
  lastTask: String
});

// User collection
Doris.User = Doris.db.model('user', {
  facebookId: Number,
  displayName: String,
  teamId: String
});

/**
 * Add new user if it don't exists.
 *
 * @param {Object} user
 * @param {Function} callback
 */

Doris.addUser = function (user, callback) {
  if (typeof user === 'object' && typeof callback === 'function') {
    var self = this;
    this.findUserByFacebookId(user.id, function (err, res) {
      if (!res.length) {
        var u = new self.User({
          facebookId: user.id,
          displayName: user.displayName,
          teamId: 0
        });
        u.save(callback);
      } else {
        callback(null, res[0]);
      }
    });
  }
};

/**
 * Add user to team.
 *
 * @param {String} userId
 * @param {Number} teamId
 * @param {Function} callback
 */

Doris.addUserToTeam = function (userId, teamId, callback) {
  if (typeof userId === 'string' && typeof teamId === 'string' && typeof callback === 'function') {
    this.User.findById(userId, function (err, user) {
      user.teamId = teamId;
      user.save(callback);
    });
  }
};

/**
 * Find user by Facebook user id.
 *
 * @param {String} facebookId
 *
 * @return {Object}
 */

Doris.findUserByFacebookId = function (facebookId, callback) {
  if (typeof facebookId !== undefined && typeof callback === 'function') {
    this.User.find({
      facebookId: facebookId
    }, callback);
  }
};

/**
 * Find user by id.
 *
 * @param {String} userId,
 * @param {Function} callback
 */

Doris.findUser = function (userId, callback) {
  if (typeof userId === 'string' && typeof callback === 'function') {
    this.User.findById(userId, callback);
  }
};

/**
 * Add task.
 *
 * @param {Object} team
 * @param {Function} callback
 */

Doris.addTask = function (task, callback) {
  if (typeof task === 'object' && typeof callback === 'function') {
    new this.Task(task).save(callback);
  }
};

/**
 * Create team.
 *
 * @param {Object} team
 * @param {Function} callback
 */

Doris.addTeam = function (team, callback) {
  if (typeof team === 'object' && typeof callback === 'function') {
    new this.Team(team).save(callback);
  }
};

/**
 * Get all users.
 *
 * @param {Function} callback
 */

Doris.users = function (callback) {
  if (typeof callback === 'function') {
    this.User.find({}, callback);
  }
};

/**
 * Get all tasks.
 *
 * @param {Function} callback
 */

Doris.tasks = function (callback) {
  if (typeof callback === 'function') {
    this.Task.find({}, callback);
  }
};

/**
 * Get team name by user id.
 *
 * @param {String} userId
 * @param {Function} callback
 */

Doris.getTeamByUserId = function (userId, callback) {
  if (typeof userId === 'string' && typeof callback === 'function') {
    this.findUser(userId, function (err, user) {
      if (!err) {
        this.Team.findById(user.teamId, function (err, team) {
          if (!err) callback(null, team);
        });
      }
    });
  }
};

/**
 * Get team by id.
 *
 * @param {String} id
 * @param {Function} callback
 */

Doris.getTeam = function (teamId, callback) {
  if (typeof teamId === 'string' && typeof callback === 'function') {
    this.Team.findById(teamId, function (err, team) {
      if (!err) callback(null, team);
    });
  }
};

/**
 * Save last task for team.
 *
 * @param {String} teamId
 * @param {String} taskId
 * @param {Function} callback
 */

Doris.saveLastTask = function (teamId, taskId, callback) {
  if (typeof teamId === 'string' && typeof taskId === 'string' && typeof callback === 'function') {
    this.Team.findById(teamId, function (err, team) {
      if (!err) {
        team.lastTask = taskId;
        team.save(callback);
      }
    });
  }
};

/**
 * Get the next mission for the team id.
 *
 * @param {String} teamId
 * @param {Function} callback
 */

Doris.getNextMission = function (teamId, callback) {
  if (typeof teamId === 'string' && typeof callback === 'function') {
    this.Team.findById(teamId, function (err, team) {
      if (team.lastMission === '') {
        Doris.tasks(function (err, tasks) {
          if (!err && tasks[0]) {
            callback(err, task[0]);
          }
        });
      } else {
        if (team.lastTask !== '') {
          Doris.Task.findById(team.lastTask, function (err, task) {
            if (!err && task) {
              callback(err, task);
            }
          });
        } else {
          Doris.tasks(function (err, tasks) {
            if (!err && tasks.length) {
              callback(err, tasks[0]);
            }
          });
        }
      }
    });
  }
};

/**
 * Get the next mission for the team id and task id.
 *
 * @param {String} teamId
 * @param {String} taskId
 * @param {Boolean} completed
 * @param {Function} callback
 */

Doris.getNextMissionInArray = function (teamId, taskId, completed, callback) {
  if (typeof teamId === 'string' && typeof taskId === 'string' && typeof completed === 'boolean' && typeof callback === 'function') {
    this.Team.findById(teamId, function (err, team) {
      if (completed) {
        Doris.tasks(function (err, tasks) {
          var _i = 0;
          for (var i = 0, l = tasks.length; i < l; i++) {
            if (tasks[i]._id === taskId) {
              _i = i + 1;
              break;
            }
          }
          callback(err, tasks[_i || 0]);
        });
      } else {
        Doris.Task.findById(taskId, function (err, task) {
          callback(err, task);
        });
      }
    });
  }
};


/**
 * Check if the hole team has completed the task.
 *
 * @param {String} teamId
 * @param {string} taskId
 * @param {Function} callback
 */

Doris.teamCompletedTask = function (teamId, taskId, callback) {
  if (typeof teamId === 'string' && typeof taskId === 'string' && typeof callback === 'function') {
    var comp = false;
    Doris.Team.findById(teamId, function (err, team) {
      Doris.User.find({
        teamId: teamId
      }, function (err, users) {
        for (var i = 0, l = users.length; i < l; i++) {
          Doris.missionCompletedUser(taskId, teamId, ('' + users[i]._id), function (err, completed) {
            comp = completed;
            if (users.length === i) {
              callback(err, comp, team);
            }
          });
        }
      });
    });
  }
};

/**
 * Save mission for a user
 *
 * @param {String} taskId,
 * @param {String} userId,
 * @param {Object} data
 * @param {Function} callback
 */

Doris.saveMission = function (taskId, userId, data, callback) {
  if (typeof taskId === 'string' && typeof userId === 'string' && typeof data === 'object' && typeof callback === 'function') {
    this.findUser(userId, function (err, user) {
      Doris.Mission.find({
        taskId: taskId,
        userId: userId
      }, function (err, mission) {
        Doris.Mission.findById(mission._id, function (err, mission) {
          Doris.Task.findById(mission.taskId, function (err, task) {
            mission.completed = data.completed;
            mission.points = task.points;
            mission.bounsPoints = task.bounsPoints;
          });
        });
      });
    });
  }
};

/**
 * Check if mission is completed or not.
 *
 * @param {String} taskId
 * @param {String} teamId
 * @param {Function} callback
 */

Doris.missionCompleted = function (taskId, teamId, callback) {
  if (typeof taskId === 'string' && typeof teamId === 'string' && typeof callback === 'function') {
    this.Mission.find({
      taskId: taskId,
      teamId: teamId,
    }, function (err, missions) {
      if (missions !== undefined && missions.length) {
        callback(null, missions[0].completed);
      } else {
        callback(err, false);
      }
    });
  }
};

/**
 * Check if mission is completed or not.
 *
 * @param {String} taskId
 * @param {String} teamId
 * @param {Function} callback
 */

Doris.missionCompletedUser = function (taskId, teamId, userId, callback) {
  if (typeof taskId === 'string' && typeof teamId === 'string' && typeof userId === 'string' && typeof callback === 'function') {
    this.Mission.find({
      taskId: taskId,
      teamId: teamId,
      userId: userId
    }, function (err, missions) {
      if (missions !== undefined && missions.length) {
        callback(null, missions[0].completed);
      } else {
        callback(err, false);
      }
    });
  }
};

module.exports = Doris;

/*
Doris.Mission = Doris.db.model('mission', {
  taskId: Number,
  userId: Number,
  teamId: Number,
  completed: Boolean,
  points: Number,
  bounsPoints: Number
});*/