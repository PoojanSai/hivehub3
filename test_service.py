import sys
sys.path.append('backend_ignore')
from backend_ignore.app.db.database import SessionLocal
from backend_ignore.app.services import team_service
from backend_ignore.app.schemas.team import TeamCreate

db = SessionLocal()
try:
    print("Creating test team...")
    team = team_service.create_team(db, TeamCreate(name="Internal Test", owner_id=1))
    print(f"Team created with code: {team.join_code}")
    
    print("Joining test team as user 4...")
    joined = team_service.join_team_by_code(db, 4, team.join_code)
    if joined:
        print("SUCCESS: User 4 joined the team.")
    else:
        print("FAILURE: Join service returned None.")
finally:
    db.close()
