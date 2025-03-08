from __future__ import annotations

import base64
from email.utils import parseaddr, parsedate_to_datetime
from typing import Any, Dict, List

from models.email import Email
from pydantic import Field

from .account import build_gmail_service, check_gmail_token_file


def _parse_messages(
    gmail_service, messages: List[Dict[str, Any]]
) -> List[Email]:
    results = []
    for message in messages:
        message_id = message["id"]
        message_data = (
            gmail_service.users()
            .messages()
            .get(userId="me", format="full", id=message_id)
            .execute()
        )

        headers = {
            header["name"].lower(): header["value"]
            for header in message_data["payload"]["headers"]
        }

        subject = headers.get("subject", "(No Subject)")
        sender = headers.get("from", "")
        name, email_address = parseaddr(sender)
        date = parsedate_to_datetime(headers.get("date", ""))
        thread_id = message_data.get("threadId", "")
        snippet = message_data.get("snippet", "")

        # Get the email body
        if "parts" in message_data["payload"]:
            parts = message_data["payload"]["parts"]
            body = ""
            html_body = ""
            for part in parts:
                if part["mimeType"] == "text/plain":
                    data = part["body"]["data"]
                    body += base64.urlsafe_b64decode(data).decode("utf-8")
                elif part["mimeType"] == "text/html":
                    data = part["body"]["data"]
                    html_body += base64.urlsafe_b64decode(data).decode("utf-8")
        else:
            body = base64.urlsafe_b64decode(
                message_data["payload"]["body"]["data"]
            ).decode("utf-8")
            html_body = body
        results.append(
            Email(
                id=message_id,
                thread_id=thread_id,
                subject=subject,
                from_=name or email_address.split("@")[0],
                email=email_address,
                date=date,
                snippet=snippet,
                body=body,
                html_body=html_body,
            ).model_dump(by_alias=True)
        )
    return results


def search_messages(
    query: str = Field(..., description="The query to search for"),
    max_results: int = Field(
        ..., description="The maximum number of results to return"
    ),
) -> List[Dict]:
    """Search for messages in Gmail."""
    if not check_gmail_token_file():
        raise ValueError(
            "No valid token file found. Please login to Gmail first."
        )
    gmail_service = build_gmail_service()
    results = (
        gmail_service.users()
        .messages()
        .list(userId="me", q=query, maxResults=max_results)
        .execute()
        .get("messages", [])
    )
    result_messages = _parse_messages(gmail_service, results)
    return result_messages
