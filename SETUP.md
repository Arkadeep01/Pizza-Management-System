# Pizza Management System Setup Guide

This guide will help you set up the Pizza Management System with all required configurations.

## Prerequisites

1. Python 3.8 or higher
2. MongoDB installed and running
3. A Gmail account (for SMTP)
4. A Razorpay account

## Step 1: Install Python Dependencies

Open a terminal/command prompt and run:

```bash
pip install -r requirements.txt
```

## Step 2: Configure Environment Variables

Run the setup script:

```bash
python setup_env.py
```

The script will guide you through setting up:

1. **MongoDB Connection**
   - Enter your MongoDB URI
   - If you're using a local MongoDB, press Enter to use the default

2. **Email (SMTP) Configuration**
   - SMTP Host (e.g., smtp.gmail.com)
   - SMTP Port (e.g., 587)
   - Your email address
   - Your email password or app password
   
   Note: For Gmail, you'll need to:
   1. Enable 2-Step Verification
   2. Generate an App Password
   3. Use the App Password instead of your regular password

3. **Razorpay Configuration**
   - Enter your Razorpay Key ID
   - Enter your Razorpay Key Secret
   
   Note: You can find these in your Razorpay Dashboard under Settings > API Keys

4. **Frontend URL**
   - Enter your frontend URL (e.g., http://localhost:3000)

5. **Admin Email**
   - Enter the email address for receiving notifications

## Step 3: Test Your Configuration

After setting up, run the test script:

```bash
python test_config.py
```

This will verify:
- MongoDB connection
- SMTP configuration (sends a test email)
- Razorpay integration

## Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is running
- Check if the URI is correct
- Verify network connectivity

### SMTP Issues
- For Gmail:
  - Enable 2-Step Verification
  - Generate an App Password
  - Use the App Password instead of your regular password
- Check if the SMTP host and port are correct
- Verify your email credentials

### Razorpay Issues
- Verify your API keys in the Razorpay Dashboard
- Make sure you're using test mode keys for development
- Check if your Razorpay account is active

## Support

If you encounter any issues during setup, please:
1. Check the error messages in the terminal
2. Verify all credentials and configurations
3. Make sure all prerequisites are met
4. Contact support if the issue persists 