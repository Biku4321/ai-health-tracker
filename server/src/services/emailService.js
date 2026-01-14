const nodemailer = require('nodemailer');

// Setup Transporter (Use Gmail or any SMTP service)
// .env me EMAIL_USER aur EMAIL_PASS add karna mat bhulna
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or 'smtp.mailtrap.io' for testing
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, // For Gmail, use "App Password" not login password
    },
  tls: {
    rejectUnauthorized: false
  }
});

// 1. Send Verification Email
const sendVerificationEmail = async (email, token) => {
  // Frontend URL (change this to your actual deployed URL later)
  const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${token}`;

  const mailOptions = {
    from: '"HealthAI Support" <no-reply@healthai.com>',
    to: email,
    subject: 'Verify your HealthAI Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #4EC5C1; text-align: center;">Welcome to HealthAI! 🚀</h2>
        <p>Hi there,</p>
        <p>Thank you for signing up. Please verify your email address to activate your account and start tracking your health.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background-color: #1A3C40; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify My Account</a>
        </div>
        <p style="font-size: 12px; color: #888;">If you didn't create an account, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent to:", email);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};

// 2. Send Welcome Email (With Features List)
const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: '"HealthAI Team" <welcome@healthai.com>',
    to: email,
    subject: 'You’re In! Here’s what you can do with HealthAI',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #1A3C40;">Welcome, ${name}! 🎉</h2>
        <p>Your account is fully active. We are thrilled to have you on board.</p>
        
        <h3 style="color: #4EC5C1;">Explore Your New Powers:</h3>
        <ul style="line-height: 1.6;">
          <li><strong>🎙️ Voice Logging:</strong> Just say what you ate or how you feel, and AI will log it for you.</li>
          <li><strong>🥗 Food Vision:</strong> Snap a photo of your meal to instantly get calorie & macro estimates.</li>
          <li><strong>🤖 AI Chat Coach:</strong> Chat 24/7 with our AI doctor for personalized health advice.</li>
          <li><strong>📊 Clinical Reports:</strong> Generate professional PDF reports of your health trends for your doctor.</li>
          <li><strong>🏆 Gamification:</strong> Earn XP, maintain streaks, and unlock badges as you get healthier.</li>
        </ul>

        <p>Ready to start?</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" style="background-color: #4EC5C1; color: #1A3C40; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
        </div>
        
        <p>Cheers,<br>The HealthAI Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent to:", email);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};

// 3. Send Support Email (For Contact Form)
const sendSupportEmail = async (name, email, message) => {
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER, // Send to Admin
      subject: `New Support Message from ${name}`,
      text: message,
      html: `<p><strong>From:</strong> ${email}</p><p>${message}</p>`
    };
    await transporter.sendMail(mailOptions);
  };
  

module.exports = { sendVerificationEmail, sendWelcomeEmail, sendSupportEmail };