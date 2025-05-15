import secrets
import base64
import os
from dotenv import load_dotenv

def generate_jwt_key():
    # Generate a secure random key of 32 bytes (256 bits)
    random_bytes = secrets.token_bytes(32)
    
    # Convert to base64 for storage
    jwt_key = base64.b64encode(random_bytes).decode('utf-8')
    
    # Load existing .env file if it exists
    load_dotenv()
    
    # Write the key to .env file
    with open('.env', 'a+') as f:
        # Move to the beginning of file to check if JWT_SECRET_KEY already exists
        f.seek(0)
        content = f.read()
        if 'JWT_SECRET_KEY' not in content:
            f.write(f'\nJWT_SECRET_KEY={jwt_key}\n')
            print('JWT key has been generated and stored in .env file')
        else:
            print('JWT_SECRET_KEY already exists in .env file')

if __name__ == '__main__':
    generate_jwt_key() 