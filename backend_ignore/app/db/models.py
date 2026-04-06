from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Text, DateTime, ForeignKey, Boolean,
)
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)

    owned_teams = relationship("Team", back_populates="owner")
    memberships = relationship("TeamMember", back_populates="user")
    versions = relationship("Version", back_populates="creator")


class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    color = Column(String(7), default="#2dd4bf")
    join_code = Column(String(20), unique=True, index=True, nullable=True) # nullable=True to avoid migration issues with existing data
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="owned_teams")
    members = relationship("TeamMember", back_populates="team", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="team", cascade="all, delete-orphan")


class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    team = relationship("Team", back_populates="members")
    user = relationship("User", back_populates="memberships")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    lang = Column(String(60), default="")
    stars = Column(Integer, default=0)
    team_id = Column(Integer, ForeignKey("teams.id", ondelete="CASCADE"), nullable=False)

    team = relationship("Team", back_populates="projects")
    files = relationship("File", back_populates="project", cascade="all, delete-orphan")


class File(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    content = Column(Text, default="")
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)

    project = relationship("Project", back_populates="files")
    versions = relationship("Version", back_populates="file", cascade="all, delete-orphan", order_by="Version.created_at.desc()")


class Version(Base):
    __tablename__ = "versions"

    id = Column(Integer, primary_key=True, index=True)
    tag = Column(String(60), nullable=False)
    label = Column(String(120), default="")
    stable = Column(Boolean, default=False)
    content = Column(Text, nullable=False)
    file_id = Column(Integer, ForeignKey("files.id", ondelete="CASCADE"), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    file = relationship("File", back_populates="versions")
    creator = relationship("User", back_populates="versions")


class ChatMessageDB(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User")
    project = relationship("Project")
