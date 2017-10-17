// Base server
// const http = require('http');
// const port = 3000;

// const requestHandler = (request, response) => {
//   console.log(request.url);
//   response.end('Hello Node.js Server!');
// };

// const server = http.createServer(requestHandler);

// server.listen(port, (err) => {
//   if (err) {
//     return console.log('something bad happened', err);
//   }

//   console.log(`server is listening on ${port}`);
// });

// Middleares
// const express = require('express');
// const app = express();
// const port = 3000;

// app.use((request, response, next) => {
//   console.log(request.headers);
//   next();
// });

// app.use((request, response, next) => {
//   request.chance = Math.random();
//   next();
// });

// app.get('/', (request, response) => {
//   // response.send('Hello from Express!');
//   // response.json({
//   //   chance: request.chance
//   // });
//   throw new Error('oops');
// });

// app.use((err, request, response, next) => {
//   // log the error, for now just console.log
//   console.log(err);
//   response.status(500).send('Something broke!');
// });

// app.listen(port, (err) => {
//   if (err) {
//     return console.log('something bad happened', err);
//   }

//   console.log(`server is listening on ${port}`);
// });

// HTML
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutDir: path.join(__dirname, 'views/layouts')
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (request, response) => {
  response.render('home', {
    name: 'John'
  });
});

// parse application/json
app.use(bodyParser.json());

// storing data in a global variable
// app.get('/users', (request, response) => {
//   response.json(users);
// });

// const users = [];

// app.post('/users', function(req, res) {
//   // retrive user posted data from the body
//   const user = req.body;
//   users.push({
//     name: user.name,
//     age: user.age
//   });
//   res.send('successfully registered');
// });

// storing data in a file
// const fs = require('fs');

// app.get('/users', (request, response) => {
//   fs.readFile('users.txt', 'utf8', (err, data) => {
//     if (err) throw err;
//     response.json(JSON.parse(data));
//   })
// });

// app.post('/users', function(req, res) {
//   const user = req.body;
//   fs.appendFile(
//     'users.txt',
//     JSON.stringify({
//       name: user.name,
//       age: user.age
//     }),
//     (err) => {
//       res.send('successfully registered');
//     }
//   );
// });

// Node.js Database Interaction
// CREATE TABLE users(name VARCHAR(20), age SMALLINT);
const { Client } = require('pg');

// client.connect((err) => {
//   if (err) {
//     return console.log('error fetching client from pool', err);
//   }

//   client.query('SELECT $1::varchar AS my_first_query', ['node_hero'], (err, result) => {

//     if (err) {
//       return console.log('error happened during query', err);
//     }

//     console.log(result.rows[0]);
//     process.exit(0);
//     // client.close();
//   });
// });

app.get('/users', (request, response, next) => {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'node_hero',
    user: 'fabriciosilva',
    password: 'root'
  });

  client.connect((err) => {
    if (err) {
      // pass the error to the express error handler
      return next(err);
    }

    client.query('SELECT name, age FROM users', [], (err, result) => {
      if (err) {
        // pass the error to the express error handler
        return next(err);
      }

      client.end();
      response.json(result.rows);
    });
  });

});

app.post('/users', (request, response, next) => {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'node_hero',
    user: 'fabriciosilva',
    password: 'root'
  });

  const user = request.body;

  client.connect((err) => {
    if (err) {
      // pass the error to the express error handler
      return next(err);
    }

    client.query('INSERT INTO users (name, age) VALUES ($1, $2)', [user.name, user.age], (err, result) => {
      if (err) {
        // pass the error to the express error handler
        return next(err);
      }

      client.end();
      response.send(200);
    });
  });
});

const rp = require('request-promise');

const getRequest = () => {
  const options = {
    method: 'GET',
    uri: 'https://risingstack.com'
  };

  rp(options)
    .then((response) => {
      // request was successful, use the response object at will
    })
    .catch((err) => {
      // something bad happened, handle error
    });
};

const postRequest = () => {
  const option = {
    method: 'POST',
    uri: 'https://risingstack.com/login',
    body: {
      foo: 'bar'
    },
    // JSON stringifies the body automatically
    json: true
  };

  rp(options)
    .then((response) => {
      // handle the response
    })
    .catch((err) => {
      // deal with the error
    });
};

const queryStringRequest = () => {
  const option = {
    method: 'GET',
    uri: 'https://risingstack.com',
    qs: {
      limit: 10,
      skip: 20,
      sort: 'asc'
    }
  };

  rp(options)
    .then((response) => {
      // handle the response
    })
    .catch((err) => {
      // deal with the error
    });
};

const headersRequest = () => {
  const option = {
    method: 'GET',
    uri: 'https://risingstack.com',
    headers: {
      'User-Agent': 'Request-Promise',
      'Authorization': 'Basic QWxhZGRpbjpPcGVuU2VzYW1l'
    }
  };

  rp(options)
    .then((response) => {
      // handle the response
    })
    .catch((err) => {
      // deal with the error
    });
};

app.get('/:city', (request, response) => {
  rp({
    uri: 'http://apidev.accuweather.com/locations/v1/search',
    qs: {
      q: request.params.city,
      apiKey: 'api-key'
    },
    json: true
  })
  .then((data) => {
    res.render('index', data);
  })
  .catch((err) => {
    console.log(err);
    response.render('error');
  });
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
});
