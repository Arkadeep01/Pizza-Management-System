const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Send verification email
exports.sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Verify Your Email',
    html: `
      <h1>Welcome to Pizza Management System!</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>This link will expire in 24 hours.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Send password reset email
exports.sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Reset Your Password',
    html: `
      <h1>Password Reset Request</h1>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Send order status update email
exports.sendOrderStatusUpdate = async (email, orderId, status) => {
  const statusMap = {
    received: 'Order Received',
    in_kitchen: 'In the Kitchen',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered'
  };

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Order Status Update',
    html: `
      <h1>Order Status Update</h1>
      <p>Your order #${orderId} is now: <strong>${statusMap[status]}</strong></p>
      <p>Track your order at: ${process.env.FRONTEND_URL}/orders/${orderId}</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Send order cancellation notification
exports.sendOrderCancellationNotification = async (email, orderId) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Order Cancelled',
    html: `
      <h1>Order Cancelled</h1>
      <p>Your order #${orderId} has been cancelled.</p>
      <p>If you have any questions, please contact our support team.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Send low stock alert
exports.sendLowStockAlert = async (itemType, itemName, currentQuantity) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.ADMIN_EMAIL,
    subject: 'Low Stock Alert',
    html: `
      <h1>Low Stock Alert</h1>
      <p>The following item is running low on stock:</p>
      <ul>
        <li>Type: ${itemType}</li>
        <li>Name: ${itemName}</li>
        <li>Current Quantity: ${currentQuantity}</li>
      </ul>
      <p>Please update the inventory as soon as possible.</p>
    `
  };

  await transporter.sendMail(mailOptions);
}; 