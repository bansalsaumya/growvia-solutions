require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;
const MESSAGES_FILE = path.join(__dirname, 'messages.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory with fresh response headers for development
app.use(express.static(__dirname, {
    maxAge: 0,
    etag: true
}));

// Initialize messages.json if it doesn't exist
if (!fs.existsSync(MESSAGES_FILE)) {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify([]));
}

// Set up Nodemailer transporter using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// API Endpoint to handle contact form submissions
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    const newMessage = {
        id: Date.now(),
        name,
        email,
        message,
        date: new Date().toISOString()
    };

    try {
        // Save to file (local backup)
        const data = fs.readFileSync(MESSAGES_FILE, 'utf8');
        const messages = JSON.parse(data);
        messages.push(newMessage);
        fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));

        // Send Email
        const mailOptions = {
            from: `"Growvia Solutions Agency" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `New Lead from ${name} - Growvia Solutions`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #f26522; border-radius: 10px; padding: 20px;">
                    <h2 style="color: #f26522; border-bottom: 2px solid #f26522; padding-bottom: 10px; margin-top: 0;">New Lead Received (Localhost)!</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <p><strong>Message / Project Details:</strong></p>
                    <div style="background-color: #fff3ee; padding: 15px; border-radius: 8px; border-left: 4px solid #f26522;">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully locally');
        res.status(200).json({ success: true, message: 'Message saved and email sent!' });
    } catch (error) {
        console.error('Error saving or sending email:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// GET route to fetch all messages for the admin dashboard
app.get('/api/messages', (req, res) => {
    try {
        if (!fs.existsSync(MESSAGES_FILE)) {
            return res.json([]);
        }
        const data = fs.readFileSync(MESSAGES_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Failed to read messages' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
