const User = require('../models/User');
const Company = require('../models/Company');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password, role, companyId } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = new User({
      email,
      password,
      role: role || 'company',
      companyId: companyId || null
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        companyId: user.companyId
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    let company = null;
    if (user.companyId) {
      company = await Company.findById(user.companyId);
    }

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        company: company ? {
          id: company._id,
          name: company.name,
          embedKey: company.embedKey
        } : null
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    let company = null;
    
    if (user.companyId) {
      company = await Company.findById(user.companyId);
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        company: company ? {
          id: company._id,
          name: company.name,
          embedKey: company.embedKey
        } : null
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};