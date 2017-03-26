const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const winston = require('winston');
const routes = require('./routes');
const bodyParser = require('body-parser');
const jsonResponse = require('./middleware/response');

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(helmet());
app.use(morgan('tiny'));
app.use(bodyParser.json());

app.use(jsonResponse);
app.use('/api', routes);

app.use((req, res) => res.forbidden());

/**
 * Listen for connections.
 */
app.listen(app.get('port'), () => {
  winston.info('Node app is running on port', app.get('port'));
});
