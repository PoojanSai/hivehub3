from pydantic import BaseModel
from typing import Optional
from .version import VersionOut


class FileCreate(BaseModel):
    name: str
    project_id: int
    content: Optional[str] = ""


class FileOut(BaseModel):
    id: int
    name: str
    content: str
    project_id: int
    versions: list[VersionOut] = []

    model_config = {"from_attributes": True}
