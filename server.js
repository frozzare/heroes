/**
 * Module dependencies
 */

var app = require('./config/app')();

if (require('os').hostname() === 'pukka') {
  app.set('port', 4000);
}

// Listen to port.
app.listen(app.get('port'));