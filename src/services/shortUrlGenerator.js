import crypto from 'crypto';

function generateShortUrl() {
  return crypto.randomBytes(5).toString('hex');
}

export default generateShortUrl;
