import random
import string
from sqlalchemy.orm import Session, joinedload
from ..db.models import Team, TeamMember
from ..schemas.team import TeamCreate


def _gen_code() -> str:
    return "HH-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=6))


def create_team(db: Session, data: TeamCreate) -> Team:
    code = _gen_code()
    # Check for collision (optional but good)
    while db.query(Team).filter(Team.join_code == code).first():
        code = _gen_code()

    team = Team(name=data.name, color=data.color, owner_id=data.owner_id, join_code=code)
    db.add(team)
    db.flush()
    member = TeamMember(team_id=team.id, user_id=data.owner_id)
    db.add(member)
    db.commit()
    db.refresh(team)
    return team


def join_team_by_code(db: Session, user_id: int, code: str) -> Team | None:
    from sqlalchemy import func
    # Case-insensitive match for join code
    team = db.query(Team).filter(func.lower(Team.join_code) == func.lower(code)).first()
    if not team:
        return None

    # Check if user exists
    from ..db.models import User
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None

    # Check if already a member
    exist = db.query(TeamMember).filter(TeamMember.team_id == team.id, TeamMember.user_id == user_id).first()
    if exist:
        return team

    # Create membership
    member = TeamMember(team_id=team.id, user_id=user_id)
    db.add(member)
    db.commit()
    db.refresh(team)
    return team


def get_teams(db: Session) -> list[Team]:
    return (
        db.query(Team)
        .options(
            joinedload(Team.members),
            joinedload(Team.projects),
        )
        .all()
    )


def get_team(db: Session, team_id: int) -> Team | None:
    return (
        db.query(Team)
        .options(joinedload(Team.members), joinedload(Team.projects))
        .filter(Team.id == team_id)
        .first()
    )


def add_member(db: Session, team_id: int, user_id: int) -> TeamMember:
    member = TeamMember(team_id=team_id, user_id=user_id)
    db.add(member)
    db.commit()
    db.refresh(member)
    return member
