from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..schemas.version import VersionCreate, VersionOut
from ..services import version_service

router = APIRouter(prefix="/versions", tags=["versions"])


@router.post("", response_model=VersionOut)
def create_version(data: VersionCreate, db: Session = Depends(get_db)):
    return version_service.create_version(db, data)


@router.get("/{file_id}", response_model=list[VersionOut])
def list_versions(file_id: int, db: Session = Depends(get_db)):
    return version_service.get_versions_by_file(db, file_id)


@router.get("/detail/{version_id}", response_model=VersionOut)
def get_version(version_id: int, db: Session = Depends(get_db)):
    v = version_service.get_version(db, version_id)
    if not v:
        raise HTTPException(status_code=404, detail="Version not found")
    return v
