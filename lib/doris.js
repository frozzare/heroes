var mongoose = require('mongoose')
  , Doris = {};

Doris.db = mongoose.createConnection('mongodb://localhost/heroes');

// Mission collection
Doris.Mission = Doris.db.model('mission', {
  taskId: Number,
  userId: Number,
  teamId: Number,
  completed: Boolean,
  points: Number,
  bounsPoints: Number
});

// Task collection
Doris.Task = Doris.db.model('task', {
  name: String,
  background: String,
  description: String,
  image: String,
  points: Number,
  bonuspoints: Number,
  type: Number
});

// Team collection
Doris.Team = Doris.db.model('team', {
  name: String,
  numberofMembers: Number,
  membersOnTask: Number,
  points: Number,
  bounsPoints: Number
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
      console.log(arguments);
      if (!err) callback(null, team);
    });
  }
};

/**
 * Get the next mission for the team or user id.
 *
 * @param {Number} id
 * @param {String} type
 * @param {Function} callback
 */

Doris.getNextMission = function (id, type) {

};

/**
 * Check if mission is completed or not.
 *
 * @param {Number} id
 * @param {Function} callback
 */

Doris.missionCompleted = function (id, callback) {

};

module.exports = Doris;