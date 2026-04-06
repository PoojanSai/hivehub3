from pydantic import BaseModel
from typing import Optional
from .project import ProjectOut


class TeamCreate(BaseModel):
    name: str
    color: Optional[str] = "#2dd4bf"
    owner_id: int


class TeamOut(BaseModel):
    id: int
    name: str
    color: str
    join_code: Optional[str] = None
    members: int = 0
    projects: list[ProjectOut] = []

    model_config = {"from_attributes": True}
