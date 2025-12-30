const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { auth, isMaster } = require('../middleware/auth');

router.post('/', auth, isMaster, companyController.createCompany);
router.get('/', auth, isMaster, companyController.getCompanies);
router.get('/:id', auth, companyController.getCompany);
router.put('/:id', auth, companyController.updateCompany);
router.delete('/:id', auth, isMaster, companyController.deleteCompany);

module.exports = router;