import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    // Set up Nodemailer transporter using Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"Growvia Solutions Agency" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // Send to yourself
        replyTo: email, // Reply to the sender
        subject: `New Lead from ${name} - Growvia Solutions`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #f26522; border-radius: 10px; padding: 20px;">
                <h2 style="color: #f26522; border-bottom: 2px solid #f26522; padding-bottom: 10px; margin-top: 0;">New Lead Received!</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Message / Project Details:</strong></p>
                <div style="background-color: #fff3ee; padding: 15px; border-radius: 8px; border-left: 4px solid #f26522;">
                    ${message.replace(/\n/g, '<br>')}
                </div>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 0.8rem; color: #666;">This message was sent from the Growvia Solutions contact form.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to', process.env.EMAIL_USER);
        return res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false, error: 'Failed to send message. Please try again later.' });
    }
}
