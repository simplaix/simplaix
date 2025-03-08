from __future__ import annotations

from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict


class TicketType(str, Enum):
    TASK = "Task"
    BUG = "Bug"
    STORY = "Story"


class JiraTicketData(BaseModel):
    model_config = ConfigDict(
        extra="allow",
    )
    id: str
    title: str
    description: str
    type: Optional[TicketType] = None


class JiraRequest(BaseModel):
    summary: str
    description: str
    type: TicketType
