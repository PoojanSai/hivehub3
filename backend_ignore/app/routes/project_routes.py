from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..schemas.project import ProjectCreate, ProjectOut
from ..services import project_service

router = APIRouter(prefix="/projects", tags=["projects"])


@router.post("", response_model=ProjectOut)
def create_project(data: ProjectCreate, db: Session = Depends(get_db)):
    project = project_service.create_project(db, data)
    project = project_service.get_project(db, project.id)
    return project


@router.get("/{team_id}", response_model=list[ProjectOut])
def list_projects(team_id: int, db: Session = Depends(get_db)):
    return project_service.get_projects_by_team(db, team_id)
