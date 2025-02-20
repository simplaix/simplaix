from __future__ import annotations

import uuid
from typing import List, Optional

from models.draft import Draft, Recipients  # Add import for models


async def create_draft(
    draft: Draft
) -> Draft:
    """Create an email draft.

    Args:
        draft: Draft object
    """
    pass
    # recipients = Recipients(
    #     to=to_recipients or [], cc=cc_recipients, bcc=bcc_recipients
    # )

    # draft = Draft(
    #     id=str(uuid.uuid4()),
    #     recipients=recipients,
    #     subject=subject,
    #     content=content,
    #     attachments=[],
    # )

    # Here you would typically integrate with an email service
    # For now, we'll just return the draft
    # return draft
