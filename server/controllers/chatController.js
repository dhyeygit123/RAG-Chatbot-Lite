const Company = require('../models/Company');
const QA = require('../models/QA');
const ChatLog = require('../models/ChatLog');
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


exports.query = async (req, res) => {
  try {
    const { embedKey, message, sessionId } = req.body;

    if (!embedKey || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const company = await Company.findOne({ embedKey });
    if (!company || company.status !== 'active') {
      return res.status(404).json({ error: 'Invalid or inactive company' });
    }

    // Find matching Q&A
    let match = await QA.findOne({
      companyId: company._id,
      isActive: true,
      question: { $regex: new RegExp(`^${message.trim()}$`, 'i') }
    });

    // Fallback to partial match
    if (!match) {
      match = await QA.findOne({
        companyId: company._id,
        isActive: true,
        question: { $regex: new RegExp(message.trim(), 'i') }
      });
    }

    let response;

if (match) {
  response = match.answer;
} else {
  // No match → use AI
  const qas = await QA.find({
    companyId: company._id,
    isActive: true
  }).limit(20);

  const contextText = qas.map(q => `Q: ${q.question}\nA: ${q.answer}`).join("\n\n");

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are a support chatbot for "${company.name}".
Only answer based on the Q&A data provided below.
If the answer is NOT found within this data, respond with:
"I’m sorry, I don’t have that information. Please contact support."

### Website Knowledge Base:
${contextText}

### User Question:
${message}

### Your Answer (based ONLY on the above data):
  `;

  const aiResult = await model.generateContent(prompt);
  response = aiResult.response.text().trim();
}


    // Log the chat
    await ChatLog.create({
      companyId: company._id,
      sessionId: sessionId || 'unknown',
      userMessage: message,
      botResponse: response,
      matched: !!match,
      qaId: match?._id
    });

    res.json({ 
      response,
      matched: !!match
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const { embedKey } = req.params;

    const company = await Company.findOne({ embedKey });
    if (!company || company.status !== 'active') {
      return res.status(404).json({ error: 'Invalid or inactive company' });
    }

    res.json({
      settings: company.settings,
      companyName: company.name
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};