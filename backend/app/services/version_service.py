from sqlalchemy.orm import Session
from ..db.models import Version, File
from ..schemas.version import VersionCreate


def create_version(db: Session, data: VersionCreate) -> Version:
    version = Version(
        file_id=data.file_id,
        content=data.content,
        tag=data.tag,
        label=data.label,
        stable=data.stable,
        created_by=data.created_by,
    )
    db.add(version)
    # Also update the file's latest content
    file = db.query(File).filter(File.id == data.file_id).first()
    if file:
        file.content = data.content
    db.commit()
    db.refresh(version)
    return version


def get_versions_by_file(db: Session, file_id: int) -> list[Version]:
    return (
        db.query(Version)
        .filter(Version.file_id == file_id)
        .order_by(Version.created_at.desc())
        .all()
    )


def get_version(db: Session, version_id: int) -> Version | None:
    return db.query(Version).filter(Version.id == version_id).first()
