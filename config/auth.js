var Doris = require('../lib/doris')
  , url = 'http://localhost:3000';

module.exports = function (app, passport, FacebookStrategy) {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use(new FacebookStrategy({
      clientID: '558696214178336',
      clientSecret: '2b3d4d5449ac470c5d21c6039a6280af',
      callbackURL: url + '/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'photos']
    },
    function (accessToken, refreshToken, profile, done) {
      Doris.addUser(profile, function (err, user) {
        if (err) return done(err);
        done(null, user);
      });
    }
  ));

  app.get('/auth/facebook', passport.authenticate('facebook'));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      console.log(req.body, req.params, req.session, req.cookies);
      res.redirect('/');
    });
}