from app.db.database import engine
from app.db.models import Base
from sqlalchemy import text

print("Connecting to database to clear tables...")
with engine.begin() as conn:
    conn.execute(text("TRUNCATE TABLE chat_messages, versions, files, projects, team_members, teams RESTART IDENTITY CASCADE;"))
print("All projects, teams, and related data have been successfully deleted.")
