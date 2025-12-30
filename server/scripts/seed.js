require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Company = require('../models/Company');
const QA = require('../models/QA');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Company.deleteMany({});
    await QA.deleteMany({});
    console.log('Cleared existing data');

    // Create master admin
    const masterAdmin = await User.create({
      email: 'admin@chatbot.com',
      password: 'admin123',
      role: 'master'
    });
    console.log('Created master admin:', masterAdmin.email);

    // Create sample company
    const company = await Company.create({
      name: 'Demo Company',
      email: 'demo@company.com',
      status: 'active',
      settings: {
        botName: 'Demo Bot',
        welcomeMessage: 'Hello! How can I help you today?',
        themeColor: '#3b82f6',
        position: 'right'
      }
    });
    console.log('Created company:', company.name);
    console.log('Embed Key:', company.embedKey);

    // Create company admin
    const companyAdmin = await User.create({
      email: 'demo@company.com',
      password: 'demo123',
      role: 'company',
      companyId: company._id
    });
    console.log('Created company admin:', companyAdmin.email);

    // Create sample Q&As
    const sampleQAs = [
      {
        companyId: company._id,
        question: 'What are your business hours?',
        answer: 'We are open Monday to Friday, 9 AM to 5 PM EST.',
        category: 'General'
      },
      {
        companyId: company._id,
        question: 'How can I contact support?',
        answer: 'You can contact our support team at support@company.com or call us at 1-800-123-4567.',
        category: 'Support'
      },
      {
        companyId: company._id,
        question: 'What is your refund policy?',
        answer: 'We offer a 30-day money-back guarantee. Please contact our support team to initiate a refund.',
        category: 'Billing'
      },
      {
        companyId: company._id,
        question: 'Do you offer free trials?',
        answer: 'Yes! We offer a 14-day free trial with no credit card required.',
        category: 'Pricing'
      },
      {
        companyId: company._id,
        question: 'Where are you located?',
        answer: 'Our headquarters is located in San Francisco, California.',
        category: 'General'
      }
    ];

    await QA.insertMany(sampleQAs);
    console.log('Created sample Q&As');

    console.log('\n=== Seed Data Summary ===');
    console.log('Master Admin:');
    console.log('  Email: admin@chatbot.com');
    console.log('  Password: admin123');
    console.log('\nCompany Admin:');
    console.log('  Email: demo@company.com');
    console.log('  Password: demo123');
    console.log('\nCompany Embed Key:', company.embedKey);
    console.log('\nTotal Q&As:', sampleQAs.length);

    mongoose.connection.close();
    console.log('\nDatabase seeded successfully!');
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();