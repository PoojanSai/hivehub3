from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class VersionCreate(BaseModel):
    file_id: int
    content: str
    tag: str
    label: Optional[str] = ""
    stable: Optional[bool] = False
    created_by: Optional[int] = None


class VersionOut(BaseModel):
    id: int
    tag: str
    label: str
    stable: bool
    content: str
    file_id: int
    created_by: Optional[int] = None
    created_at: datetime

    model_config = {"from_attributes": True}
