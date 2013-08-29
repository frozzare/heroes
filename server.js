/**
 * Module dependencies
 */

var express = require('express')
  , fs = require('fs')
  , app = express();

// Express settings
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile); // use ejs as view engine
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/public'));

// Register index route.
app.get('/', function (req, res) {
  res.render('index');
});

// Register simple *.html route.
app.get('/*.html', function (req, res) {
  res.render(req.params[0].replace('.html', ''));
});

// Load JavaScript from bower components directory, cdnjs, jsdelivr or public/js directory.
app.get(/\/js\/(.*)\.(.*)/, function (req, res, next) {
  var lib = req.params[0]
    , min = req.query.min ? '.min' : ''
    , ver = req.query.version
    , ext = '.' + (req.params[1] ? req.params[1] : 'js')
    , cdn = req.query.cdn
    , path;

  if (!lib) {
    return next();
  }

  res.contentType('text/javascript');

  if (cdn) {
    if (!ver) {
      res.json({
        err: 'version query string is required when using cdn'
      });
    } else {
      if (cdn === 'cdnjs') {
        path = 'http://cdnjs.cloudflare.com/ajax/libs/' + lib + '/' + ver + '/' + lib + min + ext;
      } else {
        path = 'http://cdn.jsdelivr.net/' + lib + '/' + ver + '/' + lib + min + ext;
      }
      res.redirect(path);
    }
  } else {
    lib = lib.split('/');
    path = __dirname + '/bower_components/' + lib[0] + '/' + (lib[1] ? lib[1] : lib[0]) + min + ext;
    fs.readFile(path, function (err, buf) {
      if (err) {
        next();
      } else {
        res.send(buf.toString());
      }
    });
  }
});

// Listen to port.
app.listen(app.get('port'));