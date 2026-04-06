import json
from collections import defaultdict
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()

# project_id -> set of connected websockets
_rooms: dict[int, set[WebSocket]] = defaultdict(set)


@router.websocket("/ws/{project_id}")
async def project_ws(ws: WebSocket, project_id: int):
    await ws.accept()
    _rooms[project_id].add(ws)
    try:
        while True:
            data = await ws.receive_text()
            payload = json.loads(data)
            # Broadcast to all clients in the same project room
            for client in _rooms[project_id]:
                if client != ws:
                    await client.send_text(json.dumps(payload))
    except WebSocketDisconnect:
        _rooms[project_id].discard(ws)
        if not _rooms[project_id]:
            del _rooms[project_id]
