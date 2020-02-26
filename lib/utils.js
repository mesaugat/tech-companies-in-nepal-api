const winston = require('winston');

/**
 * Splits and trims a string.
 *
 * @param {String} link
 * @param {String|RegExp} splitter
 */
const splitAndTrim = (link, splitter) => {
  return link.split(splitter).map(s => s.trim());
};

/**
 * Winston logger instance.
 */
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

module.exports = { splitAndTrim, logger };
