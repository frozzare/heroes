/**
 * Doris is the name of the api file for Heroes.
 */

function Doris () {
  this.url = '';
}

/**
 * Find user by Facebook user id.
 *
 * @param {String} fbUserId
 *
 * @return {Object}
 */

 Doris.prototype.findUser = function (fbUserId) {
  if (typeof fbUserId !== undefined) {
     return {
       name: {
         first: 'Fredrik',
         last: 'Forsmo'
       },
       team: 1
     }
  }
  return {};
};

/**
 * Get the next mission for the team or user id.
 *
 * @param {Int} id
 * @param {String} type
 */

Doris.prototype.getNextMission = function (id, type) {
  
};

/**
 * Check if mission is completed or not.
 *
 * @param {Int} id
 *
 * @return {Boolean}
 */

Doris.prototype.missionCompleted = function (id) {
  return false;
};