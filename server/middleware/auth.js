const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const isMaster = (req, res, next) => {
  if (req.user.role !== 'master') {
    return res.status(403).json({ error: 'Master admin access required' });
  }
  next();
};

const isCompanyAdmin = (req, res, next) => {
  if (req.user.role !== 'company') {
    return res.status(403).json({ error: 'Company admin access required' });
  }
  next();
};

module.exports = { auth, isMaster, isCompanyAdmin };