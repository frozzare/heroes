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
      callbackURL: 'http://localhost:3000/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'photos']
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        var user = {
          alias: profile.username,
          uid: profile.id,
          name: {
            first: profile.name.givenName,
            last: profile.name.familyName
          }
        };
        app.set('loggedin', true);
        return done(null, profile);
      });
    }
  ));

  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: 'read_stream'
  }));

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));
}