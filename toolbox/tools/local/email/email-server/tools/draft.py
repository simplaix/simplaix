from __future__ import annotations

import uuid
from typing import List, Optional

from models.draft import Draft, Recipients  # Add import for models


async def create_draft(
    subject: str,
    content: str,
    to_recipients: List[str] = None,
    cc_recipients: Optional[List[str]] = None,
    bcc_recipients: Optional[List[str]] = None,
) -> Draft:
    """Create an email draft.

    Args:
        subject: Email subject line
        content: Email body content
        to_recipients: List of primary recipient email addresses
        cc_recipients: Optional list of CC recipient email addresses
        bcc_recipients: Optional list of BCC recipient email addresses
    """
    recipients = Recipients(
        to=to_recipients or [], cc=cc_recipients, bcc=bcc_recipients
    )

    draft = Draft(
        id=str(uuid.uuid4()),
        recipients=recipients,
        subject=subject,
        content=content,
        attachments=[],
    )

    # Here you would typically integrate with an email service
    # For now, we'll just return the draft
    return draft
