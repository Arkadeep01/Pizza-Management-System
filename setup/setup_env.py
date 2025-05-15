import os
from dotenv import load_dotenv, set_key
from pathlib import Path

# Get the project root directory (parent of setup directory)
PROJECT_ROOT = Path(__file__).parent.parent

def setup_environment():
    """Interactive setup for all environment variables"""
    env_path = PROJECT_ROOT / '.env'
    
    # Create .env file if it doesn't exist
    if not env_path.exists():
        env_path.touch()
    
    # Load existing environment variables
    load_dotenv(env_path)
    
    print("\n=== Environment Setup ===")
    print("This will help you set up all required environment variables.")
    print("Press Enter to keep existing values.\n")
    
    # MongoDB Setup
    print("\n=== MongoDB Configuration ===")
    mongodb_uri = input("Enter MongoDB URI (default: mongodb://localhost:27017/pizza_shop): ").strip()
    if not mongodb_uri:
        mongodb_uri = "mongodb://localhost:27017/pizza_shop"
    set_key(env_path, 'MONGODB_URI', mongodb_uri)
    
    # JWT Secret
    print("\n=== JWT Configuration ===")
    jwt_secret = input("Enter JWT Secret (default: your-secret-key): ").strip()
    if not jwt_secret:
        jwt_secret = "your-secret-key"
    set_key(env_path, 'JWT_SECRET', jwt_secret)
    
    # SMTP Setup
    print("\n=== SMTP Configuration ===")
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
    
    # Razorpay Setup
    print("\n=== Razorpay Configuration ===")
    print("Get your API keys from: https://dashboard.razorpay.com/app/keys")
    
    razorpay_key_id = input("Enter Razorpay Key ID: ").strip()
    set_key(env_path, 'RAZORPAY_KEY_ID', razorpay_key_id)
    
    razorpay_key_secret = input("Enter Razorpay Key Secret: ").strip()
    set_key(env_path, 'RAZORPAY_KEY_SECRET', razorpay_key_secret)
    
    # Frontend URL
    print("\n=== Frontend Configuration ===")
    frontend_url = input("Enter Frontend URL (default: http://localhost:3000): ").strip()
    if not frontend_url:
        frontend_url = "http://localhost:3000"
    set_key(env_path, 'FRONTEND_URL', frontend_url)
    
    print("\nEnvironment setup completed!")
    print(f"Configuration saved to: {env_path}")

if __name__ == "__main__":
    setup_environment() 