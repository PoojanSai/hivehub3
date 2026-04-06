from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..schemas.file import FileCreate, FileOut
from ..services import file_service

router = APIRouter(prefix="/files", tags=["files"])


@router.post("", response_model=FileOut)
def create_file(data: FileCreate, db: Session = Depends(get_db)):
    f = file_service.create_file(db, data)
    f = file_service.get_file(db, f.id)
    return f


@router.get("/{project_id}", response_model=list[FileOut])
def list_files(project_id: int, db: Session = Depends(get_db)):
    return file_service.get_files_by_project(db, project_id)
