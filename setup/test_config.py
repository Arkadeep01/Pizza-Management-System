import os
from dotenv import load_dotenv
from pathlib import Path
import sys

# Add the parent directory to Python path
PROJECT_ROOT = Path(__file__).parent.parent
sys.path.append(str(PROJECT_ROOT))

# Import setup modules
from setup.db_connection import get_mongodb_connection
from setup.smtp_connection import get_smtp_connection, send_test_email
from setup.razorpay_connection import get_razorpay_client, test_razorpay_integration

def test_all_configurations():
    """Test all system configurations"""
    print("\n=== Testing All Configurations ===\n")
    
    # Test MongoDB
    print("Testing MongoDB connection...")
    try:
        client = get_mongodb_connection()
        print("✓ MongoDB connection successful")
    except Exception as e:
        print(f"✗ MongoDB connection failed: {str(e)}")
        return False
    
    # Test SMTP
    print("\nTesting SMTP connection...")
    try:
        server = get_smtp_connection()
        print("✓ SMTP connection successful")
        
        print("\nSending test email...")
        send_test_email()
        print("✓ Test email sent successfully")
    except Exception as e:
        print(f"✗ SMTP test failed: {str(e)}")
        return False
    
    # Test Razorpay
    print("\nTesting Razorpay integration...")
    try:
        client = get_razorpay_client()
        test_order = test_razorpay_integration()
        print("✓ Razorpay integration successful")
    except Exception as e:
        print(f"✗ Razorpay test failed: {str(e)}")
        return False
    
    print("\n=== All Tests Completed Successfully ===")
    return True

if __name__ == "__main__":
    test_all_configurations() 