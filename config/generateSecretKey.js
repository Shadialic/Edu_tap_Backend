const crypto = require('crypto');
const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString('hex');
};
generateSecretKey();
