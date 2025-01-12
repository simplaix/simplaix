from __future__ import annotations

from utils.utils import (
    build_resource_service,
    get_gmail_credentials,
    has_valid_token,
)


def check_gmail_token_file() -> bool:
    """Check if a valid token file exists locally."""
    return has_valid_token()


def build_gmail_service():
    """Get Gmail credentials."""
    token_file = get_gmail_credentials()
    return build_resource_service(token_file)


def gmail_login():
    """Login to Gmail."""
    build_gmail_service()
    return {"status": "OK"}
