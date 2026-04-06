from sqlalchemy.orm import Session, joinedload
from ..db.models import Project, File, Version
from ..schemas.project import ProjectCreate


def create_project(db: Session, data: ProjectCreate) -> Project:
    project = Project(
        name=data.name,
        lang=data.lang,
        stars=data.stars,
        team_id=data.team_id,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def get_projects_by_team(db: Session, team_id: int) -> list[Project]:
    return (
        db.query(Project)
        .filter(Project.team_id == team_id)
        .options(
            joinedload(Project.files).joinedload(File.versions),
        )
        .all()
    )


def get_project(db: Session, project_id: int) -> Project | None:
    return (
        db.query(Project)
        .options(joinedload(Project.files).joinedload(File.versions))
        .filter(Project.id == project_id)
        .first()
    )
