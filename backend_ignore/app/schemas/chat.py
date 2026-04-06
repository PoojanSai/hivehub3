from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ChatMessageCreate(BaseModel):
    project_id: int
    user_id: int
    text: str


class ChatMessageOut(BaseModel):
    id: int
    project_id: int
    user_id: int
    user_name: str = ""
    user_color: str = "#2dd4bf"
    text: str
    created_at: datetime

    model_config = {"from_attributes": True}
