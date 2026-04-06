from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..schemas.team import TeamCreate, TeamOut
from ..services import team_service

router = APIRouter(prefix="/teams", tags=["teams"])


def _team_to_out(team) -> dict:
    return {
        "id": team.id,
        "name": team.name,
        "color": team.color,
        "join_code": team.join_code,
        "members": len(team.members),
        "projects": [
            {
                "id": p.id,
                "name": p.name,
                "lang": p.lang,
                "stars": p.stars,
                "team_id": p.team_id,
                "versions": [
                    {
                        "id": v.id,
                        "tag": v.tag,
                        "label": v.label,
                        "stable": v.stable,
                        "content": v.content,
                        "file_id": v.file_id,
                        "created_by": v.created_by,
                        "created_at": v.created_at,
                    }
                    for f in p.files
                    for v in f.versions
                ],
            }
            for p in team.projects
        ],
    }


@router.post("", response_model=TeamOut)
def create_team(data: TeamCreate, db: Session = Depends(get_db)):
    team = team_service.create_team(db, data)
    team = team_service.get_team(db, team.id)
    return _team_to_out(team)


@router.get("", response_model=list[TeamOut])
def list_teams(user_id: int | None = None, db: Session = Depends(get_db)):
    teams = team_service.get_teams(db)
    # If user_id provided, only show teams they belong to
    if user_id:
        teams = [t for t in teams if any(m.user_id == user_id for m in t.members)]
    return [_team_to_out(t) for t in teams]


@router.get("/{team_id}", response_model=TeamOut)
def get_team(team_id: int, db: Session = Depends(get_db)):
    team = team_service.get_team(db, team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return _team_to_out(team)


@router.post("/{team_id}/members")
def add_member(team_id: int, user_id: int, db: Session = Depends(get_db)):
    return team_service.add_member(db, team_id, user_id)
@router.post("/join")
def join_team(data: dict, db: Session = Depends(get_db)):
    try:
        code = (data.get("code") or "").strip().upper()
        user_id = data.get("user_id")
        
        print(f"[JOIN] Attempting join: code={code}, userId={user_id}")
        
        if not code or not user_id:
            raise HTTPException(status_code=400, detail="Code and User ID required")
        
        team = team_service.join_team_by_code(db, int(user_id), code)
        if not team:
            print(f"[JOIN] FAILED: Team with code {code} not found.")
            raise HTTPException(status_code=404, detail="Invalid team code")
        
        print(f"[JOIN] SUCCESS: User {user_id} joined {team.name}")
        return _team_to_out(team)
    except Exception as e:
        print(f"[JOIN] CRITICAL ERROR: {str(e)}")
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail=str(e))
