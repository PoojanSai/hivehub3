from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db.database import engine, Base, SessionLocal
from .db.models import User, Team, TeamMember, Project, File, Version
from .routes import (
    user_routes,
    team_routes,
    project_routes,
    file_routes,
    version_routes,
    chat_routes,
    ws_routes,
)


def _seed(db):
    """Seed database with initial data if empty."""
    if db.query(User).first():
        return

    # Users
    u1 = User(name="Aisha K.", email="aisha@hivehub.dev")
    u2 = User(name="Rajan M.", email="rajan@hivehub.dev")
    u3 = User(name="Mei L.", email="mei@hivehub.dev")
    u4 = User(name="You", email="you@hivehub.dev")
    db.add_all([u1, u2, u3, u4])
    db.commit()


SAMPLE_CODE = """import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import type { Collaborator, Tab } from '@/types';

// Real-time collaboration hook
export function useCollab(roomId: string) {
  const { collaborators } = useApp();
  const [connected, setConnected] = useState(false);
  const [cursors, setCursors] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const ws = new WebSocket(`wss://api.hivehub.dev/rooms/${roomId}`);
    ws.onopen  = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (e) => {
      const { userId, line } = JSON.parse(e.data);
      setCursors(prev => new Map(prev).set(userId, line));
    };
    return () => ws.close();
  }, [roomId]);

  function broadcast(line: number) {
    // Emit cursor position to all collaborators
    console.log('cursor at line', line);
  }

  return { connected, cursors, broadcast };
}""".strip()

SAMPLE_CODE_2 = """import React from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';

export default function App() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}""".strip()

SAMPLE_GO = """package sync

import (
    "context"
    "log"
    "net/http"
    "github.com/gorilla/websocket"
)

type Hub struct {
    clients    map[*Client]bool
    broadcast  chan []byte
    register   chan *Client
    unregister chan *Client
}

func NewHub() *Hub {
    return &Hub{
        broadcast:  make(chan []byte),
        register:   make(chan *Client),
        unregister: make(chan *Client),
        clients:    make(map[*Client]bool),
    }
}

func (h *Hub) Run() {
    for {
        select {
        case client := <-h.register:
            h.clients[client] = true
            log.Println("client connected")
        case client := <-h.unregister:
            if _, ok := h.clients[client]; ok {
                delete(h.clients, client)
                close(client.send)
            }
        case message := <-h.broadcast:
            for client := range h.clients {
                select {
                case client.send <- message:
                default:
                    close(client.send)
                    delete(h.clients, client)
                }
            }
        }
    }
}""".strip()

SAMPLE_PY = """from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"])

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401)
    except JWTError:
        raise HTTPException(status_code=401)
    return username

@app.post("/token")
async def login(username: str, password: str):
    # Validate credentials
    access_token = jwt.encode({"sub": username}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": access_token, "token_type": "bearer"}""".strip()

SAMPLE_TF = """provider "aws" {
  region = "us-west-2"
}

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "hivehub-vpc"
    Environment = "production"
  }
}

resource "aws_subnet" "public" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "hivehub-public-${count.index}"
  }
}

resource "aws_ecs_cluster" "app" {
  name = "hivehub-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}""".strip()

SAMPLE_RS = """use tokio::net::TcpListener;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;

type Metrics = Arc<RwLock<HashMap<String, f64>>>;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let metrics: Metrics = Arc::new(RwLock::new(HashMap::new()));
    let listener = TcpListener::bind("0.0.0.0:9090").await?;

    println!("Monitor agent listening on :9090");

    loop {
        let (mut socket, addr) = listener.accept().await?;
        let metrics = metrics.clone();

        tokio::spawn(async move {
            let mut buf = [0; 1024];
            match socket.read(&mut buf).await {
                Ok(n) if n > 0 => {
                    let data = String::from_utf8_lossy(&buf[..n]);
                    if let Some((key, val)) = parse_metric(&data) {
                        let mut m = metrics.write().await;
                        m.insert(key, val);
                    }
                    socket.write_all(b"OK").await.ok();
                }
                _ => {}
            }
        });
    }
}

fn parse_metric(data: &str) -> Option<(String, f64)> {
    let parts: Vec<&str> = data.splitn(2, ':').collect();
    if parts.len() == 2 {
        let val: f64 = parts[1].trim().parse().ok()?;
        Some((parts[0].trim().to_string(), val))
    } else {
        None
    }
}""".strip()


def _migrate(db):
    try:
        from sqlalchemy import text
        print("Migrating: Checking for join_code column...")
        db.execute(text("ALTER TABLE teams ADD COLUMN IF NOT EXISTS join_code VARCHAR(20) UNIQUE;"))
        db.commit()
        
        # Ensure existing teams have a code
        from app.services.team_service import _gen_code
        from app.db.models import Team
        teams_no_code = db.query(Team).filter(Team.join_code == None).all()
        if teams_no_code:
            print(f"Migration: Generating codes for {len(teams_no_code)} teams...")
            for t in teams_no_code:
                t.join_code = _gen_code()
            db.commit()
        print("Migration: Database schema and data verified.")
    except Exception as e:
        print(f"Migration notice: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        _migrate(db)
        _seed(db)
    finally:
        db.close()
    yield


app = FastAPI(title="HiveHub API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_routes.router, prefix="/api")
app.include_router(team_routes.router, prefix="/api")
app.include_router(project_routes.router, prefix="/api")
app.include_router(file_routes.router, prefix="/api")
app.include_router(version_routes.router, prefix="/api")
app.include_router(chat_routes.router, prefix="/api")
app.include_router(ws_routes.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
