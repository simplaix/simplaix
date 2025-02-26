from __future__ import annotations

import base64
from email.message import EmailMessage
from typing import Optional

from .account import build_gmail_service, check_gmail_token_file


def reply_message(
    thread_id: str,
    to: str,
    subject: str,
    content: str,
    from_: Optional[str] = None,
) -> dict:
    """Reply an email message using Gmail API.
    Always call the draft tool to show the draft to human and ask for confirmation before send the reply email,
    call this tool to send the reply email with given thread id..

    Args:
        thread_id: Thread id of the email to reply to
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
        create_message = {"raw": encoded_message, "threadId": thread_id}

        # Send the message
        return (
            gmail_service.users()
            .messages()
            .send(userId="me", body=create_message)
            .execute()
        )
    except Exception as e:
        raise e
