const path = require('path');

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const passaport = require('passport');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const config = require('../config');
const app = express();

app.use(bodyParser.urlencoded({
  extended: false
}));

require('./authentication').init(app);

app.use(session({
  store: new RedisStore({
    url: config.redisStore.url
  }),
  secret: config.redisStore.secret,
  resave: false,
  saveUninitialized: false
}));

app.use(passaport.initialize());
app.use(passaport.session());

app.engine('.hbs', exphbs({
  defaultLayout: 'layout',
  extname: '.hbs',
  layoutsDir: path.join(__dirname),
  partialsDir: path.join(__dirname)
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname));

require('./user').init(app);
require('./note').init(app);

module.exports = app;
