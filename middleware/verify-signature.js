const crypto = require('crypto');

/**
 * Get our signature.
 *
 * @param {String|Object} blob
 * @returns {String}
 */
const signBlob = (blob) => {
  if (typeof blob === 'object') {
    blob = JSON.stringify(blob);
  }

  const hmac = crypto.createHmac('sha1', process.env.GITHUB_WEBHOOK_SECRET);

  return `sha1=${hmac.update(blob).digest('hex')}`;
};

/**
 * Verify GitHub signature.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Buffer} buffer
 */
const verifySignature = (req, res, next) => {
  if (!req.get('X-Hub-Signature')) {
    return res.badRequest('No X-Hub-Signature found on request');
  }

  if (!req.get('X-Github-Event')) {
    return res.badRequest('No X-Github-Event found on request');
  }

  if (!req.get('X-Github-Delivery')) {
    return res.badRequest('No X-Github-Delivery found on request');
  }

  const theirSignature = req.get('X-Hub-Signature');
  const ourSignature = signBlob(req.body);

  if (theirSignature !== ourSignature) {
    return res.badRequest('Invalid Signature');
  }

  next();
};

module.exports = verifySignature;
