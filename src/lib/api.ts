/* ── Central API client ── */

const BASE = '/api';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

/* ── Response shapes from backend ── */
export interface ApiVersion {
  id: number;
  tag: string;
  label: string;
  stable: boolean;
  content: string;
  file_id: number;
  created_by: number | null;
  created_at: string;
}

export interface ApiProject {
  id: number;
  name: string;
  lang: string;
  stars: number;
  team_id: number;
  versions: ApiVersion[];
}

export interface ApiTeam {
  id: number;
  name: string;
  color: string;
  members: number;
  projects: ApiProject[];
}

export interface ApiFile {
  id: number;
  name: string;
  content: string;
  project_id: number;
  versions: ApiVersion[];
}

export interface ApiChatMessage {
  id: number;
  project_id: number;
  user_id: number;
  user_name: string;
  text: string;
  created_at: string;
}

/* ── API helpers ── */
export const api = {
  teams: {
    list: (user_id?: number) => get<ApiTeam[]>(`/teams${user_id ? `?user_id=${user_id}` : ''}`),
    get: (id: number) => get<ApiTeam>(`/teams/${id}`),
    create: (data: { name: string; color: string; owner_id: number }) =>
      post<ApiTeam>('/teams', data),
    join: (data: { code: string; user_id: number }) =>
      post<ApiTeam>('/teams/join', data),
  },
  projects: {
    create: (data: { name: string; lang: string; team_id: number }) =>
      post<ApiProject>('/projects', data),
  },
  files: {
    listByProject: (projectId: number) => get<ApiFile[]>(`/files/${projectId}`),
    create: (data: { name: string; project_id: number; content?: string }) =>
      post<ApiFile>('/files', data),
  },
  versions: {
    listByFile: (fileId: number) => get<ApiVersion[]>(`/versions/${fileId}`),
    get: (versionId: number) => get<ApiVersion>(`/versions/detail/${versionId}`),
    create: (data: {
      file_id: number;
      content: string;
      tag: string;
      label?: string;
      stable?: boolean;
      created_by?: number;
    }) => post<ApiVersion>('/versions', data),
  },
  chat: {
    list: (projectId: number) => get<ApiChatMessage[]>(`/chat/${projectId}`),
    send: (data: { project_id: number; user_id: number; text: string }) =>
      post<ApiChatMessage>('/chat', data),
  },
};
