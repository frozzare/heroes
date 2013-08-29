// 558696214178336 + 2b3d4d5449ac470c5d21c6039a6280af

/**
 * Module dependencies
 */

var app = require('./config/app')()
  , fs = require('fs');

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

// Listen to port.
app.listen(app.get('port'));