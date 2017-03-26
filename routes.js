const fs = require('fs');
const app = require('express');
const winston = require('winston');
const Table = require('./lib/table');
const _object = require('lodash/object');
const fetchCommit = require('./lib/fetch-commit');
const processDiff = require('./lib/process-diff');

const { get } = _object;

/**
 * Express router.
 */
const router = app.Router();

/**
 * Get API information.
 */
router.get('/', (req, res) => {
  fs.readFile('./package.json', (err, buffer) => {
    let string = buffer.toString();
    let package = JSON.parse(string);

    let { name, version, description } = package;
    let repository = package.repository.url;

    res.json({ name, version, description, repository });
  });
});

/**
 * Get all companies.
 */
router.get('/companies', (req, res) => {
  let companiesTable = new Table('Companies');

  companiesTable.all()
    .then(result => {
      let companies = result.map(company => {
        return {
          name: company.fields['Name'],
          website: company.fields['Website'],
          location: company.fields['Location Text'],
          description: company.fields['Description']
        };
      });

      return res.json(companies);
    })
    .catch((err) => {
      winston.error(err);

      return res.serverError();
    });
});

/**
 * Webhook URL for GitHub.
 */
router.post('/webhook', (req, res) => {
  if (req.get('X-Github-Event') !== 'push') {
    return res.badRequest();
  }

  let { after: newSha, ref } = req.body;
  let isMaster = ref === 'refs/heads/master';

  if (isMaster && newSha) {
    let commitsUrl = get(req, 'body.repository.commits_url', '').replace('{/sha}', `/${newSha}`);

    fetchCommit(commitsUrl)
      .then(processDiff)
      .catch((err) => {
        winston.error(err);

        return res.serverError();
      });

    return res.created();
  }

  return res.ok();
});

module.exports = router;
