// 558696214178336 + 2b3d4d5449ac470c5d21c6039a6280af

/**
 * Module dependencies
 */

var app = require('./config/app')()
  , fs = require('fs');

// Listen to port.
app.listen(process.argv[2] || app.get('port'));