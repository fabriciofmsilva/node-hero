const passport = require('passport');

function initUser(app) {
  app.get('/notes/:id', passport.authenticationMiddleware(), (request, response) => {
    response.render('note/overview', {
      id: request.params.id
    });
  });
}

module.exports = initUser;
