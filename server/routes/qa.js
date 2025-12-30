const express = require('express');
const router = express.Router();
const qaController = require('../controllers/qaController');
const { auth, isCompanyAdmin } = require('../middleware/auth');

router.get('/', auth, qaController.getQAs);
router.post('/', auth, isCompanyAdmin, qaController.createQA);
router.put('/:id', auth, qaController.updateQA);
router.delete('/:id', auth, qaController.deleteQA);

module.exports = router;