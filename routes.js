const fs = require('fs');
const app = require('express');

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
    let repository = package.repository.url

    res.json({ name, version, description, repository });
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
