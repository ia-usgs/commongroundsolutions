import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable parsing
app.use(express.json());
app.use(cors());

// Rate Limiting: 5 requests per 15 minutes
const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true, 
  legacyHeaders: false, 
});

// JSON Storage Configuration
const CUSTOMERS_FILE = path.join(process.cwd(), 'customers.json');
const TICKETS_FILE = path.join(process.cwd(), 'tickets.json');

// Initialize Files if they don't exist
const initializeFiles = () => {
  if (!fs.existsSync(CUSTOMERS_FILE)) {
    fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify({ next: 1, byEmail: {} }, null, 2));
    console.log('Created customers.json');
  }
  if (!fs.existsSync(TICKETS_FILE)) {
    fs.writeFileSync(TICKETS_FILE, JSON.stringify({ next: 1, items: [] }, null, 2));
    console.log('Created tickets.json');
  }
};

initializeFiles();

// Helper Functions
const readJson = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
};

const writeJson = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
};

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this or use host/port
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App password required for Gmail
  },
});

const sendNotificationEmail = async (ticketData, customerData) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email credentials not set. Skipping email notification.');
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'cgstraininggroup@gmail.com', // Your target email
    subject: `New Support Ticket [#${ticketData.caseNo}]: ${customerData.name}`,
    text: `
      A new contact form submission has arrived.
      
      Customer Details:
      - Name: ${customerData.name}
      - Email: ${customerData.email}
      - Phone: ${customerData.phone || 'N/A'}
      - Customer No: ${customerData.customerNo}
      
      Ticket Info:
      - Case No: ${ticketData.caseNo}
      - Status: ${ticketData.status}
      - Date: ${ticketData.date}
      
      Message:
      ${ticketData.message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email notification sent for Ticket #${ticketData.caseNo}`);
  } catch (error) {
    console.error('Failed to send email notification:', error);
  }
};

// ENDPOINTS /////////////////////

app.post('/api/contact', contactRateLimiter, async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const currentDate = new Date().toISOString();

  // 1. Customer Logic
  let customersData = readJson(CUSTOMERS_FILE);
  if (!customersData) return res.status(500).json({ error: 'Database error.' });

  let customer = customersData.byEmail[normalizedEmail];
  
  if (!customer) {
    // New Customer
    customer = {
      customerNo: customersData.next,
      name: name,
      email: normalizedEmail,
      phone: phone || null,
      firstSeen: currentDate,
      lastSeen: currentDate,
    };
    customersData.byEmail[normalizedEmail] = customer;
    customersData.next += 1;
  } else {
    // Update existing customer
    customer.lastSeen = currentDate;
    if (name) customer.name = name;
    if (phone) customer.phone = phone; // Overwrite or could handle carefully
    customersData.byEmail[normalizedEmail] = customer;
  }

  writeJson(CUSTOMERS_FILE, customersData);

  // 2. Ticket Logic
  let ticketsData = readJson(TICKETS_FILE);
  if (!ticketsData) return res.status(500).json({ error: 'Database error.' });

  const newTicket = {
    caseNo: ticketsData.next,
    customerNo: customer.customerNo,
    message: message,
    status: "Open",
    date: currentDate,
  };

  ticketsData.items.push(newTicket);
  ticketsData.next += 1;

  writeJson(TICKETS_FILE, ticketsData);

  // 3. Fire optional email asynchronously
  sendNotificationEmail(newTicket, customer);

  // 4. Return success
  return res.status(200).json({
    success: true,
    message: 'Message received successfully!',
    ticket: newTicket.caseNo
  });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});
