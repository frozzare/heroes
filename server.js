/**
 * Module dependencies
 */

var app = require('./config/app')();

// Listen to port.
app.listen(process.argv[2] || app.get('port'));