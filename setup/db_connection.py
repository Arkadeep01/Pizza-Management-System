from dotenv import load_dotenv, set_key
from pymongo import MongoClient
from pathlib import Path
import os

# Get the project root directory (parent of setup directory)
PROJECT_ROOT = Path(__file__).parent.parent

def setup_mongodb():
    """Setup MongoDB connection string in .env file"""
    env_path = PROJECT_ROOT / '.env'
    
    print("\n=== MongoDB Setup ===")
    print("Please provide your MongoDB connection string.")
    print("If you don't have one, press Enter to use the default local MongoDB.")
    
    mongodb_uri = input("Enter MongoDB URI (default: mongodb://localhost:27017/pizza_shop): ").strip()
    if not mongodb_uri:
        mongodb_uri = "mongodb://localhost:27017/pizza_shop"
    
    # Write to .env file
    set_key(env_path, 'MONGODB_URI', mongodb_uri)
    print("✓ MongoDB URI has been configured")
    
    return mongodb_uri

def get_mongodb_connection():
    """Get MongoDB connection"""
    env_path = PROJECT_ROOT / '.env'
    load_dotenv(env_path)
    
    mongodb_uri = os.getenv('MONGODB_URI')
    if not mongodb_uri:
        mongodb_uri = setup_mongodb()
    
    try:
        client = MongoClient(mongodb_uri)
        # Test the connection
        client.admin.command('ping')
        print("✓ Successfully connected to MongoDB")
        return client
    except Exception as e:
        print(f"Error connecting to MongoDB: {str(e)}")
        raise

if __name__ == "__main__":
    # Run setup and test connection
    client = get_mongodb_connection()
    db = client.get_database()
    print(f"Connected to database: {db.name}") 