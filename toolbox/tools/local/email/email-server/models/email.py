# generated by datamodel-codegen:
#   filename:  email.json
#   timestamp: 2025-01-11T20:28:55+00:00

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class Email(BaseModel):
    model_config = ConfigDict(
        extra="allow",
    )
    id: Optional[str] = None
    threadId: Optional[str] = None
    subject: str
    from_: str = Field(..., serialization_alias="from")
    date: datetime
    snippet: str
    body: str
    html_body: str = Field(
        description="The full HTML body content of the email",
        serialization_alias="htmlBody",
    )
