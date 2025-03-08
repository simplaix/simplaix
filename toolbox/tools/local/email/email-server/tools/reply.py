from __future__ import annotations

import base64
from email.message import EmailMessage

from models.email_input import EmailMessageInput

from .account import build_gmail_service, check_gmail_token_file


def reply_message(email_message: EmailMessageInput) -> dict:
    """Reply to a received email message using Gmail API.
    Attention: The thread_id is required.
    Args:
        email_message: EmailMessageInput object

    Returns:
        dict: Message object, including message id
    """
    if not check_gmail_token_file():
        raise ValueError(
            "No valid token file found. Please login to Gmail first."
        )

    try:
        gmail_service = build_gmail_service()
        message = EmailMessage()
        message.set_content(email_message.content)
        message["To"] = email_message.recipients.to
        message["Subject"] = email_message.subject

        # Encode the message
        encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
        create_message = {
            "raw": encoded_message,
            "threadId": email_message.thread_id,
        }

        # Send the message
        return (
            gmail_service.users()
            .messages()
            .send(userId="me", body=create_message)
            .execute()
        )
    except Exception as e:
        raise e
