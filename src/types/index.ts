export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  ext?: string;
  sz?: string;
  m?: string;
  open?: boolean;
  children?: FileNode[];
  /** File system handle for local files */
  handle?: FileSystemHandle;
}

export interface FSFileNode extends FileNode {
  kind: 'file' | 'directory';
  handle: FileSystemHandle;
  children?: FSFileNode[];
}

/* ─── CLOUD / TEAMS (from backend) ─── */
export interface Version {
  id: string;
  tag: string;
  label: string;
  stable: boolean;
  content?: string;
  file_id?: string;
  created_at?: string;
  /** Computed relative date for display */
  date?: string;
}

export interface Project {
  id: string;
  name: string;
  lang: string;
  stars: number;
  team_id?: string;
  versions: Version[];
}

export interface Team {
  id: string;
  name: string;
  color: string;
  members: number;
  projects: Project[];
  join_code?: string;
}

/* ─── EDITOR ─── */
export interface Tab {
  id: string;
  name: string;
  ext: string;
  sz?: string;
  m?: string;
  isDirty?: boolean;
  /** Active file content loaded from backend */
  content?: string;
  /** Active version id if loaded from a version */
  versionId?: string;
  /** Backend file id for save/version ops */
  fileId?: string;
  /** File handle for local files */
  handle?: FileSystemFileHandle;
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  color?: string;
}

export interface Collaborator {
  id: string;
  name: string;
  color: string;
  avatar: string;
  line: string;
}

export interface ChatMessage {
  userId: string;
  userName: string;
  color: string;
  text: string;
  timestamp: number;
}

/* ─── APP STATE ─── */
export type ViewMode = 'welcome' | 'editor';
