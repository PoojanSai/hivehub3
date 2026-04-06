from pydantic import BaseModel
from typing import Optional
from .version import VersionOut


class ProjectCreate(BaseModel):
    name: str
    lang: Optional[str] = ""
    stars: Optional[int] = 0
    team_id: int


class ProjectOut(BaseModel):
    id: int
    name: str
    lang: str
    stars: int
    team_id: int
    versions: list[VersionOut] = []

    model_config = {"from_attributes": True}
