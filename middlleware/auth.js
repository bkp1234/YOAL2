const jwt = require('jsonwebtoken');
// we use config because we to extract
// secret from it
const config = require('config');

module.exports = function(req, res, next) {
  // header`s token
  const token = req.header('x-auth-token');

  // user has no token
  if (!token) {
    return res
      .status(401)
      .json({ msg: 'you donot have token,denied authorization' });
  }

  // to verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
