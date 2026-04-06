from sqlalchemy.orm import Session
from ..db.models import User
from ..schemas.user import UserCreate


def create_user(db: Session, data: UserCreate) -> User:
    user = User(name=data.name, email=data.email)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_users(db: Session) -> list[User]:
    return db.query(User).all()


def get_user(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).first()
