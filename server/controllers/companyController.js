const Company = require('../models/Company');
const User = require('../models/User');

exports.createCompany = async (req, res) => {
  try {
    const { name, email, adminPassword } = req.body;

    const company = new Company({
      name,
      email
    });
    await company.save();

    // Create company admin user
    const adminUser = new User({
      email,
      password: adminPassword,
      role: 'company',
      companyId: company._id
    });
    await adminUser.save();

    res.status(201).json({ company, admin: { email: adminUser.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .select('-__v')
      .sort({ createdAt: -1 });
    res.json({ companies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json({ company });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const { name, email, status, settings } = req.body;
    
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    if (name) company.name = name;
    if (email) company.email = email;
    if (status) company.status = status;
    if (settings) company.settings = { ...company.settings, ...settings };

    await company.save();
    res.json({ company });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    // Delete associated users
    await User.deleteMany({ companyId: req.params.id });
    
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
