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
  id: string;
  tag: string;
  label: string;
  stable: boolean;
  content: string;
  file_id: string;
  created_by: string | null;
  created_at: string;
}

export interface ApiProject {
  id: string;
  name: string;
  lang: string;
  stars: string;
  team_id: string;
  versions: ApiVersion[];
}

export interface ApiTeam {
  id: string;
  name: string;
  color: string;
  members: string;
  projects: ApiProject[];
}

export interface ApiFile {
  id: string;
  name: string;
  content: string;
  project_id: string;
  versions: ApiVersion[];
}

export interface ApiChatMessage {
  id: string;
  project_id: string;
  user_id: string;
  user_name: string;
  text: string;
  created_at: string;
}

/* ── API helpers ── */
export const api = {
  teams: {
    list: (user_id?: string) => get<ApiTeam[]>(`/teams${user_id ? `?user_id=${user_id}` : ''}`),
    get: (id: string) => get<ApiTeam>(`/teams/${id}`),
    create: (data: { name: string; color: string; owner_id: string }) =>
      post<ApiTeam>('/teams', data),
    join: (data: { code: string; user_id: string }) =>
      post<ApiTeam>('/teams/join', data),
  },
  projects: {
    create: (data: { name: string; lang: string; team_id: string }) =>
      post<ApiProject>('/projects', data),
  },
  files: {
    listByProject: (projectId: string) => get<ApiFile[]>(`/files/${projectId}`),
    create: (data: { name: string; project_id: string; content?: string }) =>
      post<ApiFile>('/files', data),
  },
  versions: {
    listByFile: (fileId: string) => get<ApiVersion[]>(`/versions/${fileId}`),
    get: (versionId: string) => get<ApiVersion>(`/versions/detail/${versionId}`),
    create: (data: {
      file_id: string;
      content: string;
      tag: string;
      label?: string;
      stable?: boolean;
      created_by?: string;
    }) => post<ApiVersion>('/versions', data),
  },
  chat: {
    list: (projectId: string) => get<ApiChatMessage[]>(`/chat/${projectId}`),
    send: (data: { project_id: string; user_id: string; text: string }) =>
      post<ApiChatMessage>('/chat', data),
  },
};
