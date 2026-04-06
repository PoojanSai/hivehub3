from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..db.models import User
from ..schemas.chat import ChatMessageCreate, ChatMessageOut
from ..services import chat_service

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatMessageOut)
def send_message(data: ChatMessageCreate, db: Session = Depends(get_db)):
    msg = chat_service.create_message(db, data)
    user_row = db.query(User).filter_by(id=msg.user_id).first()
    return {
        "id": msg.id,
        "project_id": msg.project_id,
        "user_id": msg.user_id,
        "user_name": user_row.name if user_row else "",
        "text": msg.text,
        "created_at": msg.created_at,
    }


@router.get("/{project_id}", response_model=list[ChatMessageOut])
def list_messages(project_id: int, db: Session = Depends(get_db)):
    return chat_service.get_messages(db, project_id)
