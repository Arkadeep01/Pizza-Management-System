from dotenv import load_dotenv, set_key
import os
import smtplib
from email.message import EmailMessage
from pathlib import Path

# Get the project root directory (parent of setup directory)
PROJECT_ROOT = Path(__file__).parent.parent

def setup_smtp():
    """Setup SMTP configuration in .env file"""
    env_path = PROJECT_ROOT / '.env'
    
    print("\n=== SMTP Setup ===")
    print("For Gmail users:")
    print("1. Enable 2-Step Verification")
    print("2. Generate App Password: https://myaccount.google.com/apppasswords")
    print("3. Use the generated 16-character password\n")
    
    smtp_host = input("Enter SMTP Host (default: smtp.gmail.com): ").strip()
    if not smtp_host:
        smtp_host = "smtp.gmail.com"
    set_key(env_path, 'SMTP_HOST', smtp_host)
    
    smtp_port = input("Enter SMTP Port (default: 587): ").strip()
    if not smtp_port:
        smtp_port = "587"
    set_key(env_path, 'SMTP_PORT', smtp_port)
    
    smtp_user = input("Enter SMTP Email: ").strip()
    set_key(env_path, 'SMTP_USER', smtp_user)
    
    smtp_pass = input("Enter SMTP Password/App Password: ").strip()
    set_key(env_path, 'SMTP_PASS', smtp_pass)
    
    print("✓ SMTP configuration has been saved")
    return smtp_host, smtp_port, smtp_user, smtp_pass

def get_smtp_connection():
    """Get SMTP server connection"""
    env_path = PROJECT_ROOT / '.env'
    load_dotenv(env_path)
    
    smtp_host = os.getenv('SMTP_HOST')
    smtp_port = os.getenv('SMTP_PORT')
    smtp_user = os.getenv('SMTP_USER')
    smtp_pass = os.getenv('SMTP_PASS')
    
    if not all([smtp_host, smtp_port, smtp_user, smtp_pass]):
        print("SMTP configuration not found. Running setup...")
        smtp_host, smtp_port, smtp_user, smtp_pass = setup_smtp()
    
    try:
        server = smtplib.SMTP(smtp_host, int(smtp_port))
        server.starttls()
        server.login(smtp_user, smtp_pass)
        print("✓ Successfully connected to SMTP server")
        return server
    except Exception as e:
        print(f"Error connecting to SMTP server: {str(e)}")
        raise

def send_test_email():
    """Send a test email to verify SMTP configuration"""
    env_path = PROJECT_ROOT / '.env'
    load_dotenv(env_path)
    
    smtp_user = os.getenv('SMTP_USER')
    if not smtp_user:
        print("SMTP configuration not found. Running setup...")
        setup_smtp()
        smtp_user = os.getenv('SMTP_USER')
    
    try:
        server = get_smtp_connection()
        
        msg = EmailMessage()
        msg.set_content("This is a test email from your Pizza Management System.")
        msg['Subject'] = "Test Email - Pizza Management System"
        msg['From'] = smtp_user
        msg['To'] = smtp_user
        
        server.send_message(msg)
        print("✓ Test email sent successfully")
        server.quit()
    except Exception as e:
        print(f"Error sending test email: {str(e)}")
        raise

if __name__ == "__main__":
    # Run setup and send test email
    send_test_email() 