from sqlalchemy import create_engine, inspect, text
import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:saii@localhost:5432/hivehub",
)

engine = create_engine(DATABASE_URL)
inspector = inspect(engine)

print(f"Connecting to: {DATABASE_URL}")
columns = [c['name'] for c in inspector.get_columns('teams')]
print(f"Existing columns in 'teams': {columns}")

if 'join_code' not in columns:
    print("Adding 'join_code' column...")
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE teams ADD COLUMN join_code VARCHAR(20) UNIQUE;"))
        conn.commit()
    print("Done!")
else:
    print("Column already exists.")
