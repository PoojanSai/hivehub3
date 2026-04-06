from sqlalchemy import create_engine, text
import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:saii@localhost:5432/hivehub",
)

engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    try:
        print("Checking for join_code column...")
        conn.execute(text("ALTER TABLE teams ADD COLUMN join_code VARCHAR(20) UNIQUE;"))
        conn.commit()
        print("Successfully added join_code column.")
    except Exception as e:
        if "already exists" in str(e).lower():
            print("Column join_code already exists.")
        else:
            print(f"Error: {e}")
