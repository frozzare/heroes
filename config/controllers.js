var fs = require('fs');

module.exports = function (app) {
  fs.readdir(__dirname + '/../controllers', function (err, files) {
    for (var i = 0, l = files.length; i < l; i++) {
      require(__dirname + '/../controllers/' + files[i])(app);
    }
  });
};