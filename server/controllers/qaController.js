const QA = require('../models/QA');

exports.getQAs = async (req, res) => {
  try {
    const companyId = req.user.role === 'master' 
      ? req.query.companyId 
      : req.user.companyId;

    if (!companyId) {
      return res.status(400).json({ error: 'Company ID required' });
    }

    const qas = await QA.find({ companyId })
      .sort({ createdAt: -1 });
    
    res.json({ qas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createQA = async (req, res) => {
  try {
    const { question, answer, category } = req.body;
    const companyId = req.user.companyId;

    const qa = new QA({
      companyId,
      question,
      answer,
      category
    });

    await qa.save();
    res.status(201).json({ qa });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateQA = async (req, res) => {
  try {
    const { question, answer, category, isActive } = req.body;
    
    const qa = await QA.findById(req.params.id);
    if (!qa) {
      return res.status(404).json({ error: 'Q&A not found' });
    }

    // Check ownership
    if (req.user.role === 'company' && qa.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (question) qa.question = question;
    if (answer) qa.answer = answer;
    if (category) qa.category = category;
    if (typeof isActive !== 'undefined') qa.isActive = isActive;

    await qa.save();
    res.json({ qa });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteQA = async (req, res) => {
  try {
    const qa = await QA.findById(req.params.id);
    if (!qa) {
      return res.status(404).json({ error: 'Q&A not found' });
    }

    // Check ownership
    if (req.user.role === 'company' && qa.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await qa.deleteOne();
    res.json({ message: 'Q&A deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};