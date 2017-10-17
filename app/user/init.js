const passport = require('passport');

function initUser(app) {
  app.get('/', renderWelcome);
  app.get('/profile', passport.authenticationMiddleware(), renderProfile);
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));
}

function renderWelcome(request, response) {
  response.render('user/welcome');
}

function renderProfile(request, response) {
  response.render('user/profile', {
    username: request.user.username
  });
}

module.exports = initUser;
