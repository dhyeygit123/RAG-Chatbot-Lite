# 🤖 RAG-Lite: Lightweight AI Chatbot with Retrieval-Augmented Generation

A simplified, cost-effective approach to building AI-powered chatbots that stay grounded in your company's knowledge base—without the complexity of vector databases.

## 🌟 What is RAG-Lite?

RAG-Lite is a lightweight implementation of Retrieval-Augmented Generation that provides accurate, context-aware chatbot responses without requiring:
- ❌ Vector embeddings
- ❌ Pinecone/Weaviate/ChromaDB
- ❌ Complex similarity search algorithms
- ❌ High computational overhead

Instead, it uses **smart text matching** and **contextual AI generation** with just MongoDB and Google's Gemini AI.

## 🎯 Key Features

- **Three-Tier Matching Strategy**
  - Exact match (fastest)
  - Partial match (flexible)
  - AI-powered generation with context (intelligent fallback)

- **Grounded Responses**
  - AI only generates answers based on your Q&A knowledge base
  - No hallucinations or off-topic responses
  - Built-in fallback message when information isn't available

- **Company-Specific Customization**
  - Multi-tenant architecture
  - Custom branding (bot name, colors, avatars)
  - Per-company knowledge bases

- **Analytics & Tracking**
  - Logs every interaction
  - Tracks matched vs AI-generated responses
  - Session management for conversation context

## 🏗️ Architecture

```
User Question
     ↓
Exact Match? ──Yes──→ Return Stored Answer
     ↓ No
Partial Match? ──Yes──→ Return Stored Answer
     ↓ No
Retrieve Top 20 Q&As
     ↓
Pass to Gemini AI with Context
     ↓
Generate Grounded Response
     ↓
Log & Return to User
```

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/rag-lite.git
cd rag-lite
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rag-lite
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

### 4. Start the Server

```bash
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
rag-lite/
│
├── models/
│   ├── Company.js      # Company/tenant model with settings
│   ├── QA.js           # Q&A knowledge base model
│   └── ChatLog.js      # Chat interaction logs
│
├── controllers/
│   └── chatController.js  # Main chat logic & AI integration
│
├── routes/
│   └── chatRoutes.js   # API endpoints
│
├── .env                # Environment variables
└── server.js           # Express server setup
```

## 🔌 API Endpoints

### Query the Chatbot

```http
POST /api/chat/query
Content-Type: application/json

{
  "embedKey": "company_embed_key",
  "message": "What are your business hours?",
  "sessionId": "user_session_123"
}
```

**Response:**
```json
{
  "response": "We are open Monday to Friday, 9 AM to 6 PM EST.",
  "matched": true
}
```

### Get Company Settings

```http
GET /api/chat/settings/:embedKey
```

**Response:**
```json
{
  "settings": {
    "botName": "Support Bot",
    "welcomeMessage": "Hi! How can I help you today?",
    "themeColor": "#3b82f6",
    "avatarUrl": "",
    "position": "right"
  },
  "companyName": "Acme Corp"
}
```

## 💾 Database Schema

### Company Collection
```javascript
{
  name: String,
  email: String,
  status: 'active' | 'suspended',
  settings: {
    botName: String,
    welcomeMessage: String,
    themeColor: String,
    avatarUrl: String,
    position: 'left' | 'right'
  },
  embedKey: String (unique),
  createdAt: Date
}
```

### QA Collection
```javascript
{
  companyId: ObjectId,
  question: String,
  answer: String,
  category: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### ChatLog Collection
```javascript
{
  companyId: ObjectId,
  sessionId: String,
  userMessage: String,
  botResponse: String,
  matched: Boolean,      // true if Q&A match found
  usedAI: Boolean,       // true if AI generated response
  qaId: ObjectId,        // reference to matched Q&A
  timestamp: Date
}
```

## 🎨 How It Works

### The RAG-Lite Process

1. **Question Received**: User submits a question via API

2. **Smart Matching**:
   - First tries **exact match** (case-insensitive)
   - Falls back to **partial match** using regex
   - If no match, proceeds to AI generation

3. **Context Retrieval**:
   - Retrieves top 20 relevant Q&A pairs from knowledge base
   - Formats them as context for the AI

4. **AI Generation**:
   - Passes question + context to Gemini AI
   - AI generates answer ONLY based on provided context
   - If answer not in context, returns fallback message

5. **Logging & Analytics**:
   - Logs interaction with metadata
   - Tracks whether response was matched or AI-generated
   - Links to source Q&A if applicable

## 🔧 Configuration

### AI Prompt Customization

Edit `chatController.js` to customize the AI prompt:

```javascript
const prompt = `
You are a support chatbot for "${company.name}".
Only answer based on the Q&A data provided below.
If the answer is NOT found within this data, respond with:
"I'm sorry, I don't have that information. Please contact support."

### Website Knowledge Base:
${contextText}

### User Question:
${message}

### Your Answer (based ONLY on the above data):
`;
```

### Adjust Context Window

Change the number of Q&As passed to AI:

```javascript
const qas = await QA.find({
  companyId: company._id,
  isActive: true
}).limit(20);  // Adjust this number
```

## 📊 Analytics Insights

Track chatbot performance using the ChatLog collection:

```javascript
// Count matched vs AI-generated responses
db.chatLogs.aggregate([
  { $group: {
    _id: "$matched",
    count: { $sum: 1 }
  }}
])

// Most common questions without matches
db.chatLogs.find({ matched: false })
  .sort({ timestamp: -1 })
```

## 🆚 RAG-Lite vs Traditional RAG

| Feature | Traditional RAG | RAG-Lite |
|---------|----------------|----------|
| Vector Database | Required (Pinecone, Weaviate) | Not needed |
| Embeddings | Required | Not needed |
| Setup Complexity | High | Low |
| Cost | Higher (embedding APIs + vector DB) | Lower (just MongoDB + AI) |
| Response Time | Fast (vector search) | Fast (text matching + AI) |
| Best For | Large documents, semantic search | Structured Q&A, FAQs |
| Maintenance | Complex | Simple |

## 🚦 Roadmap

- [ ] Add web scraping/crawling functionality
- [ ] Implement conversation memory across sessions
- [ ] Add support for multiple languages
- [ ] Create admin dashboard for Q&A management
- [ ] Add analytics visualization
- [ ] Support for document upload and parsing
- [ ] Implement rate limiting
- [ ] Add authentication/authorization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Google Gemini AI](https://ai.google.dev/)
- Powered by [MongoDB](https://www.mongodb.com/)
- Express.js for API framework

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/rag-lite](https://github.com/yourusername/rag-lite)

---

⭐ If you find this project helpful, please consider giving it a star!

**Made with ❤️ for developers who want RAG without the complexity**
