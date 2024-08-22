const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  console.log('Token:', token);
  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach the decoded token data to the request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token, authorization denied' });
  }
}

module.exports = authMiddleware;
