const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const routes = require('./routes');
const utils = require('./lib/utils');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const jsonResponse = require('./middleware/response');
const errorHandler = require('./middleware/error-handler');

const { logger } = utils;

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(helmet());
app.use(morgan('tiny'));
app.use(bodyParser.json());

app.use(jsonResponse);
app.use('/api', routes);

app.use(errorHandler);
app.use((req, res) => res.forbidden());

/**
 * Listen for connections.
 */
app.listen(app.get('port'), () => {
  logger.info('Node app is running on port', app.get('port'));
});

module.exports = app;
