import os
import smtplib
from dotenv import load_dotenv
from email.message import EmailMessage

load_dotenv()

msg = EmailMessage()
msg.set_content("Test email from SMTP config.")
msg['Subject'] = "Hello from App"
msg['From'] = os.getenv("SMTP_USER")
msg['To'] = "recipient@example.com"

with smtplib.SMTP_SSL(os.getenv("SMTP_HOST"), int(os.getenv("SMTP_PORT"))) as server:
    server.login(os.getenv("SMTP_USER"), os.getenv("SMTP_PASS"))
    server.send_message(msg)
