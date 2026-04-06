from sqlalchemy.orm import Session
from ..db.models import ChatMessageDB, User
from ..schemas.chat import ChatMessageCreate


def create_message(db: Session, data: ChatMessageCreate) -> ChatMessageDB:
    msg = ChatMessageDB(
        project_id=data.project_id,
        user_id=data.user_id,
        text=data.text,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


def get_messages(db: Session, project_id: int, limit: int = 50) -> list[dict]:
    rows = (
        db.query(ChatMessageDB, User.name)
        .join(User, ChatMessageDB.user_id == User.id)
        .filter(ChatMessageDB.project_id == project_id)
        .order_by(ChatMessageDB.created_at.asc())
        .limit(limit)
        .all()
    )
    results = []
    for msg, user_name in rows:
        results.append({
            "id": msg.id,
            "project_id": msg.project_id,
            "user_id": msg.user_id,
            "user_name": user_name,
            "text": msg.text,
            "created_at": msg.created_at,
        })
    return results
