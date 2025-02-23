from __future__ import annotations

import base64
from email.message import EmailMessage
from typing import Optional

from .account import build_gmail_service, check_gmail_token_file


def send_message(
    to: str,
    subject: str,
    content: str,
    from_: Optional[str] = None,
) -> dict:
    """Send an email message using Gmail API.
    Always call the draft tool to show the draft to human and ask for confirmation before send.

    Args:
        to: Email address of the receiver
        subject: Subject of the email
        content: Content of the email
        from_: Optional sender email address

    Returns:
        dict: Message object, including message id
    """
    if not check_gmail_token_file():
        raise ValueError("No valid token file found. Please login to Gmail first.")

    try:
        gmail_service = build_gmail_service()
        message = EmailMessage()
        message.set_content(content)
        message["To"] = to
        message["Subject"] = subject
        if from_:
            message["From"] = from_

        # Encode the message
        encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
        create_message = {"raw": encoded_message}

        # Send the message
        return (
            gmail_service.users()
            .messages()
            .send(userId="me", body=create_message)
            .execute()
        )
    except Exception as e:
        raise e
