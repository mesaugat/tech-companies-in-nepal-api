const fs = require('fs');
const helmet = require('helmet');
const express = require('express');
const winston = require('winston');
const bodyParser = require('body-parser');

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(helmet());
app.use(bodyParser.json());

app.get('/api', (req, res) => {
  fs.readFile('./package.json', (err, buffer) => {
    let string = buffer.toString();
    let package = JSON.parse(string);

    let {name, version, description} = package;

    res.json({name, version, description});
  });
});

app.listen(app.get('port'), () => {
  winston.info('Node app is running on port', app.get('port'));
});
