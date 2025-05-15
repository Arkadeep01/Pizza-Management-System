from dotenv import load_dotenv, set_key
import razorpay
import os
import sys
import time
from pathlib import Path

# Get the project root directory (parent of setup directory)
PROJECT_ROOT = Path(__file__).parent.parent

def setup_razorpay():
    """Setup Razorpay configuration in .env file"""
    env_path = PROJECT_ROOT / '.env'
    
    print("\n=== Razorpay Setup ===")
    print("Get your API keys from: https://dashboard.razorpay.com/app/keys")
    
    razorpay_key_id = input("Enter Razorpay Key ID: ").strip()
    set_key(env_path, 'RAZORPAY_KEY_ID', razorpay_key_id)
    
    razorpay_key_secret = input("Enter Razorpay Key Secret: ").strip()
    set_key(env_path, 'RAZORPAY_KEY_SECRET', razorpay_key_secret)
    
    print("✓ Razorpay configuration has been saved")
    return razorpay_key_id, razorpay_key_secret

def get_razorpay_client():
    """Get Razorpay client"""
    env_path = PROJECT_ROOT / '.env'
    load_dotenv(env_path)
    
    key_id = os.getenv('RAZORPAY_KEY_ID')
    key_secret = os.getenv('RAZORPAY_KEY_SECRET')
    
    if not all([key_id, key_secret]):
        print("Razorpay configuration not found. Running setup...")
        key_id, key_secret = setup_razorpay()
    
    try:
        client = razorpay.Client(auth=(key_id, key_secret))
        print("✓ Successfully initialized Razorpay client")
        return client
    except Exception as e:
        print(f"Error initializing Razorpay client: {str(e)}")
        raise

def test_razorpay_integration():
    """Test Razorpay integration by creating a test order"""
    try:
        client = get_razorpay_client()
        
        # Create a test order
        data = {
            "amount": 100,  # Amount in smallest currency unit (paise for INR)
            "currency": "INR",
            "receipt": f"test_receipt_{int(time.time())}",
            "notes": {
                "description": "Test order for Razorpay integration"
            }
        }
        
        order = client.order.create(data=data)
        print("✓ Successfully created test order")
        print(f"Order ID: {order['id']}")
        return order
    except Exception as e:
        print(f"Error testing Razorpay integration: {str(e)}")
        raise

def create_payment_order(amount, currency="INR", receipt=None):
    """Create a new payment order"""
    try:
        client = get_razorpay_client()
        
        # Convert amount to smallest currency unit (paise for INR)
        amount_in_paise = int(float(amount) * 100)
        
        # Generate receipt ID if not provided
        if not receipt:
            receipt = f"order_{int(time.time())}"
        
        data = {
            "amount": amount_in_paise,
            "currency": currency,
            "receipt": receipt,
            "notes": {
                "description": "Pizza Management System Order"
            }
        }
        
        order = client.order.create(data=data)
        return order
    except Exception as e:
        print(f"Error creating payment order: {str(e)}")
        raise

def verify_payment(payment_id, order_id, signature):
    """Verify payment signature"""
    try:
        client = get_razorpay_client()
        
        # Verify signature
        params_dict = {
            'razorpay_payment_id': payment_id,
            'razorpay_order_id': order_id,
            'razorpay_signature': signature
        }
        
        client.utility.verify_payment_signature(params_dict)
        return True
    except Exception as e:
        print(f"Error verifying payment: {str(e)}")
        return False

if __name__ == "__main__":
    # Run setup and test integration
    test_razorpay_integration() 