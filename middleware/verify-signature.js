const crypto = require('crypto');
const bodyParser = require('body-parser');

/**
 * Get our signature.
 *
 * @param {String|Object} blob
 */
const signBlob = (blob) => {
  if (typeof blob === 'object') {
    blob = JSON.stringify(blob);
  }

  let secretBuffer = Buffer.from(process.env.GITHUB_WEBHOOK_SECRET, 'utf-8');
  const hmac = crypto.createHmac('sha256', secretBuffer);

  return `sha1=${hmac.update(blob).digest('hex')}`;
}

/**
 * Verify GitHub signature.
 */
const verifySignature = bodyParser.json({
  verify(req, res, buffer) {
    if (!req.get('X-Hub-Signature')) {
      throw new Error('No X-Hub-Signature found on request');
    }

    if (!req.get('X-Github-Event')) {
      throw new Error('No X-Github-Event found on request');
    }

    if (!req.get('X-Github-Delivery')) {
      throw new Error('No X-Github-Delivery found on request');
    }

    const theirSignature = req.get('X-Hub-Signature');
    const ourSignature = signBlob(buffer);

    if (!crypto.timingSafeEqual(theirSignature, ourSignature)) {
      throw new Error('Invalid Signature');
    }
  }
});

module.exports = verifySignature;
