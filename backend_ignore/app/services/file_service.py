from sqlalchemy.orm import Session, joinedload
from ..db.models import File
from ..schemas.file import FileCreate


def create_file(db: Session, data: FileCreate) -> File:
    file = File(
        name=data.name,
        content=data.content,
        project_id=data.project_id,
    )
    db.add(file)
    db.commit()
    db.refresh(file)
    return file


def get_files_by_project(db: Session, project_id: int) -> list[File]:
    return (
        db.query(File)
        .filter(File.project_id == project_id)
        .options(joinedload(File.versions))
        .all()
    )


def get_file(db: Session, file_id: int) -> File | None:
    return (
        db.query(File)
        .options(joinedload(File.versions))
        .filter(File.id == file_id)
        .first()
    )
