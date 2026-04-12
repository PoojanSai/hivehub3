import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Tab, ChatMessage, ViewMode, Collaborator, FileNode, User } from '@/types';
import { api } from '@/lib/api';
import { GoogleGenerativeAI } from "@google/generative-ai";

const COLLABORATORS: Collaborator[] = [];

interface AppState {
  viewMode: ViewMode;
  tabs: Tab[];
  activeTabId: string | null;
  chatOpen: boolean;
  messages: ChatMessage[];
  collaborators: Collaborator[];
  teams: any[];
  isLoadingTeams: boolean;
  currentUser: User | null;
  fetchTeams: () => Promise<void>;
  createTeam: (name: string, color: string) => Promise<any>;
  joinTeam: (code: string) => Promise<any>;
  createProject: (name: string, lang: string, team_id: string | number) => Promise<any>;
  openFile: (tab: Tab) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  toggleChat: () => void;
  sendMessage: (text: string) => void;
  setViewMode: (m: ViewMode) => void;
  /** Load a version's content into the active tab */
  loadVersion: (versionId: string | number) => Promise<void>;
  /** Save current tab content as a new version */
  saveVersion: (tabId: string, content: string, tag: string) => Promise<void>;
  /** Update the content of a tab (on edit) */
  updateTabContent: (tabId: string, content: string) => void;
  /** The currently focused project ID */
  activeProjectId: string | number | null;
  /** Files for the active project */
  activeProjectFiles: any[];
  /** Set the active project and load its files */
  setActiveProject: (projectId: string | number) => Promise<void>;
  /** File System Access API */
  localRootHandle: FileSystemDirectoryHandle | null;
  localFileTree: FileNode | null;
  openDirectory: () => Promise<void>;
  openLocalFile: (node: FileNode) => Promise<void>;
  broadcastCursor: (tabId: string, line: number, col: number) => void;
  cursors: Map<string, { userId: string, userName: string, color: string, line: number, col: number, tabId: string }>;
  terminalOpen: boolean;
  terminalOutput: string[];
  runCode: () => void;
  predictOutput: () => Promise<void>;
  closeTerminal: () => void;
  sendTerminalCommand: (cmd: string) => void;
  sidebarLeftWidth: number;
  setSidebarLeftWidth: (w: number) => void;
  sidebarRightWidth: number;
  setSidebarRightWidth: (w: number) => void;
  terminalHeight: number;
  setTerminalHeight: (h: number) => void;
  isGuest: boolean;
  login: (userId: string) => void;
  logout: () => void;
  continueAsGuest: () => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>('welcome');
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { userId: 'c1', userName: 'Aisha K.',  color: '#a78bfa', text: 'I pushed the nav fix 🔧', timestamp: Date.now() - 180000 },
    { userId: 'c2', userName: 'Rajan M.', color: '#34d399', text: 'Nice! Reviewing now…',     timestamp: Date.now() - 60000  },
    { userId: 'c3', userName: 'Mei L.',   color: '#fb923c', text: 'Can someone check line 24?', timestamp: Date.now() - 20000 },
  ]);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hivehub_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [isGuest, setIsGuest] = useState(() => {
    return localStorage.getItem('hivehub_guest') === 'true';
  });

  const login = (userId: string) => {
    // Mock login based on known users
    const users: Record<string, User> = {
      '1': { id: '1', name: 'Aisha K.', email: 'aisha@hivehub.dev' },
      '2': { id: '2', name: 'Rajan M.', email: 'rajan@hivehub.dev' },
      '3': { id: '3', name: 'Mei L.',   email: 'mei@hivehub.dev' },
      '4': { id: '4', name: 'You',      email: 'you@hivehub.dev' },
    };
    const user = users[userId] || { id: userId, name: 'User', email: 'user@hivehub.dev' };
    localStorage.setItem('hivehub_user', JSON.stringify(user));
    localStorage.removeItem('hivehub_guest');
    
    // Clear previous state before reload
    setTeams([]);
    setActiveProjectId(null);
    setActiveProjectFiles([]);
    
    setCurrentUser(user);
    setIsGuest(false);
  };

  const logout = () => {
    localStorage.removeItem('hivehub_user');
    localStorage.removeItem('hivehub_guest');
    
    // Hard clear states
    setTeams([]);
    setActiveProjectId(null);
    setActiveProjectFiles([]);
    setTabs([]);
    setActiveTabId(null);
    
    setCurrentUser(null);
    setIsGuest(false);
    
    // Force reload for a complete fresh start as requested
    window.location.href = '/login';
  };

  const continueAsGuest = () => {
    localStorage.setItem('hivehub_guest', 'true');
    localStorage.removeItem('hivehub_user');
    
    setTeams([]);
    setActiveProjectId(null);
    setActiveProjectFiles([]);
    
    setIsGuest(true);
    setCurrentUser(null);
  };

  const [teams, setTeams] = useState<any[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);

  const fetchTeams = useCallback(async () => {
    if (!currentUser) return;
    setIsLoadingTeams(true);
    try {
      const data = await api.teams.list(String(currentUser.id));
      setTeams(data);
    } catch (err) {
      console.error('fetchTeams failed:', err);
    } finally {
      setIsLoadingTeams(false);
    }
  }, [currentUser?.id]);

  const createTeam = async (name: string, color: string) => {
    if (!currentUser) throw new Error("Must be logged in to create a team");
    const team = await api.teams.create({ name, color, owner_id: String(currentUser.id) });
    await fetchTeams();
    return team;
  };

  const joinTeam = async (code: string) => {
    if (!currentUser) throw new Error("Must be logged in to join a team");
    const team = await api.teams.join({ code, user_id: String(currentUser.id) });
    await fetchTeams();
    return team;
  };

  const createProject = async (name: string, lang: string, team_id: string | number) => {
    const project = await api.projects.create({ name, lang, team_id: String(team_id) });
    await fetchTeams();
    return project;
  };

  React.useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const [activeProjectId, setActiveProjectId] = useState<string | number | null>(null);
  const [activeProjectFiles, setActiveProjectFiles] = useState<any[]>([]);
  const wsRef = React.useRef<WebSocket | null>(null);
  const [cursors, setCursors] = useState<Map<string, { userId: string, userName: string, color: string, line: number, col: number, tabId: string }>>(new Map());

  const [localRootHandle, setLocalRootHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [localFileTree, setLocalFileTree] = useState<FileNode | null>(null);

  const [sidebarLeftWidth, setSidebarLeftWidth] = useState(240);
  const [sidebarRightWidth, setSidebarRightWidth] = useState(246);
  const [terminalHeight, setTerminalHeight] = useState(280);

  // Connect WebSocket when project changes
  React.useEffect(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (!activeProjectId) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/${activeProjectId}`;
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => console.log('WS connected to project', activeProjectId);
    ws.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload.type === 'chat') {
          setMessages(prev => [...prev, payload.message]);
        } else if (payload.type === 'content') {
          setTabs(prev => {
            const tabExists = prev.some(t => t.id === payload.tabId);
            if (tabExists) {
              return prev.map(t => t.id === payload.tabId ? { ...t, content: payload.content, isDirty: true } : t);
            }
            return prev;
          });
        } else if (payload.type === 'cursor') {
          setCursors(prev => {
            const next = new Map(prev);
            next.set(String(payload.userId), payload.cursor);
            return next;
          });
        }
      } catch (err) {
        console.error('WS message err', err);
      }
    };
    wsRef.current = ws;
    return () => ws.close();
  }, [activeProjectId]);

  const openFile = useCallback((tab: Tab) => {
    setTabs(prev => prev.find(t => t.id === tab.id) ? prev : [...prev, tab]);
    setActiveTabId(tab.id);
    setViewMode('editor');
  }, []);

  const closeTab = useCallback((id: string) => {
    setTabs(prev => {
      const next = prev.filter(t => t.id !== id);
      if (activeTabId === id) setActiveTabId(next.length ? next[next.length - 1].id : null);
      if (next.length === 0) setViewMode('welcome');
      return next;
    });
  }, [activeTabId]);

  const sendMessage = useCallback((text: string) => {
    if (!currentUser) return;
    const msg = {
      userId: String(currentUser.id), userName: currentUser.name, color: (currentUser as any).color || '#2dd4bf', text, timestamp: Date.now(),
    };
    setMessages(prev => [...prev, msg]);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'chat', message: msg }));
    }
  }, [currentUser]);

  const updateTabContent = useCallback((tabId: string, content: string) => {
    setTabs(prev => prev.map(t =>
      t.id === tabId ? { ...t, content, isDirty: true } : t
    ));
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'content', tabId, content }));
    }
  }, []);

  const broadcastCursor = useCallback((tabId: string, line: number, col: number) => {
    if (!currentUser) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'cursor',
        userId: String(currentUser.id),
        cursor: { userId: String(currentUser.id), userName: currentUser.name, color: (currentUser as any).color || '#2dd4bf', line, col, tabId }
      }));
    }
  }, [currentUser]);

  const setActiveProject = useCallback(async (projectId: string | number) => {
    setActiveProjectId(projectId);
    try {
      const files = await api.files.listByProject(String(projectId));
      setActiveProjectFiles(files);
      // Clear local tree when switching to project view
      setLocalRootHandle(null);
      setLocalFileTree(null);
    } catch (err) {
      console.error('setActiveProject failed:', err);
    }
  }, []);

  /* ── FILE SYSTEM ACCESS API ── */

  const scanDirectory = async (handle: any): Promise<FileNode> => {
    const children: FileNode[] = [];
    for await (const entry of handle.values()) {
      if (entry.kind === 'directory') {
        children.push(await scanDirectory(entry));
      } else {
        const file = await (entry as any).getFile();
        children.push({
          id: entry.name,
          name: entry.name,
          type: 'file',
          ext: entry.name.split('.').pop() || '',
          sz: `${(file.size / 1024).toFixed(1)} KB`,
          m: new Date(file.lastModified).toLocaleDateString(),
          handle: entry
        });
      }
    }
    return {
      id: handle.name,
      name: handle.name,
      type: 'folder',
      open: true,
      children: children.sort((a,b) => (a.type === b.type ? a.name.localeCompare(b.name) : (a.type === 'folder' ? -1 : 1))),
      handle
    };
  };

  const openDirectory = async () => {
    try {
      const handle = await (window as any).showDirectoryPicker();
      setLocalRootHandle(handle);
      const tree = await scanDirectory(handle);
      setLocalFileTree(tree);
      setActiveProjectId(null); // Switch off project view
      setViewMode('editor');
    } catch (err: any) {
      if (err.name !== 'AbortError') console.error('openDirectory failed:', err);
    }
  };

  const openLocalFile = async (node: FileNode) => {
    if (!node.handle || node.type !== 'file') return;
    try {
      const file = await (node.handle as any).getFile();
      const content = await file.text();
      const tabId = `local-${node.id}`;
      const tab: Tab = {
        id: tabId,
        name: node.name,
        ext: node.ext || '',
        content,
        isDirty: false,
        handle: node.handle as any
      };
      
      setTabs(prev => {
        const existing = prev.find(t => t.id === tabId);
        if (existing) {
          return prev.map(t => t.id === tabId ? { ...t, content } : t);
        }
        return [...prev, tab];
      });
      setActiveTabId(tabId);
      setViewMode('editor');
    } catch (err) {
      console.error('openLocalFile failed:', err);
    }
  };

  const loadVersion = useCallback(async (versionId: string | number) => {
    try {
      const version = await api.versions.get(String(versionId));
      
      // If we're loading a version, we might want to also focus its project
      // Note: Backend VersionOut doesn't include projectId directly, but it includes file_id.
      // For simplicity, we'll just open the tab.
      
      const tabId = `file-${version.file_id}-v${version.id}`;
      const ext = 'ts'; // default; caller can override by openFile first
      const tab: Tab = {
        id: tabId,
        name: `${version.tag}`,
        ext,
        content: version.content,
        versionId: version.id,
        fileId: version.file_id,
        isDirty: false,
      };
      setTabs(prev => {
        const existing = prev.find(t => t.id === tabId);
        if (existing) {
          return prev.map(t => t.id === tabId ? { ...t, content: version.content, versionId: version.id } : t);
        }
        return [...prev, tab];
      });
      setActiveTabId(tabId);
      setViewMode('editor');
    } catch (err) {
      console.error('loadVersion failed:', err);
    }
  }, []);

  const saveVersion = useCallback(async (tabId: string, content: string, tag: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab?.fileId) {
      console.warn('saveVersion: tab has no fileId, cannot save to backend');
      return;
    }
    try {
      const version = await api.versions.create({
        file_id: tab.fileId,
        content,
        tag,
        label: 'Manual save',
        stable: false,
      });
      setTabs(prev => prev.map(t =>
        t.id === tabId
          ? { ...t, isDirty: false, versionId: version.id, content }
          : t
      ));
    } catch (err) {
      console.error('saveVersion failed:', err);
    }
  }, [tabs]);

  const runCode = useCallback(() => {
    setTerminalOpen(true);
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (!activeTab) {
      setTerminalOutput(["❌ No file is open"]);
      return;
    }
    setTerminalOutput([
      `▶ Running ${activeTab.name}`,
      "--------------------",
      "",
      "Hello World (simulated output)",
      "Execution completed ✅"
    ]);
  }, [tabs, activeTabId]);

  const predictOutput = useCallback(async () => {
    setTerminalOpen(true);
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (!activeTab) {
      setTerminalOutput(["❌ Error: No active file"]);
      return;
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setTerminalOutput(["❌ Error: Missing API key. Please check your .env file."]);
      return;
    }

    setTerminalOutput(["🤖 AI is thinking..."]);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const promptText = `You are a code execution engine.
Given this code, predict the exact terminal output ONLY.
Do not explain unless asked.

Code:
${activeTab.content || "console.log('No code provided');"}`;

      const result = await model.generateContent(promptText);
      const response = await result.response;
      let predictedOutput = response.text();

      // Clean up markdown code blocks if the AI includes them
      predictedOutput = predictedOutput.replace(/^\s*```[a-zA-Z]*\n?/g, '').replace(/\n?```\s*$/g, '').trim();

      const lines = predictedOutput.split('\n');
      setTerminalOutput(["Microsoft Windows [Version 10.0.19045.5011]", "(c) Microsoft Corporation. All rights reserved.", "", ...lines]);

    } catch (err: any) {
      console.error("Gemini API Error:", err);
      setTerminalOutput([`❌ Error: ${err.message || "Failed to get prediction"}`]);
    }
  }, [tabs, activeTabId]);

  const closeTerminal = useCallback(() => {
    setTerminalOpen(false);
  }, []);

  const sendTerminalCommand = useCallback((cmd: string) => {
    if (!cmd.trim()) return;
    
    // Add the command to output with CMD style prompt
    setTerminalOutput(prev => [...prev, `C:\\HiveHub\\projects> ${cmd}`]);
    
    // Simple simulated responses
    const lowerCmd = cmd.toLowerCase();
    if (lowerCmd === 'cls' || lowerCmd === 'clear') {
      setTerminalOutput(["Microsoft Windows [Version 10.0.19045.5011]", "(c) Microsoft Corporation. All rights reserved.", ""]);
    } else if (lowerCmd === 'dir' || lowerCmd === 'ls') {
      setTerminalOutput(prev => [...prev, " Volume in drive C has no label.", " Volume Serial Number is BADA-5555", "", " Directory of C:\\HiveHub\\projects", "", "04/12/2026  10:00 PM    <DIR>          .", "04/12/2026  10:00 PM    <DIR>          ..", "04/12/2026  09:00 PM             1,024 index.js", "04/12/2026  09:00 PM               512 readme.md", "               2 File(s)          1,536 bytes", "               2 Dir(s)  50,000,000,000 bytes free", ""]);
    } else if (lowerCmd === 'exit') {
      setTerminalOpen(false);
    } else if (lowerCmd === 'help') {
      setTerminalOutput(prev => [...prev, "For more information on a specific command, type HELP command-name", "CLS            Clears the screen.", "DIR            Displays a list of files and subdirectories in a directory.", "EXIT           Quits the CMD.EXE program (command interpreter).", "HELP           Provides Help information for Windows commands.", ""]);
    } else {
      setTerminalOutput(prev => [...prev, `'${cmd}' is not recognized as an internal or external command,`, "operable program or batch file.", ""]);
    }
  }, []);

  return (
    <Ctx.Provider value={{
      viewMode, tabs, activeTabId, chatOpen, messages, collaborators: COLLABORATORS,
      openFile, closeTab, setActiveTab: setActiveTabId, toggleChat: () => setChatOpen(v => !v),
      sendMessage, setViewMode, loadVersion, saveVersion, updateTabContent,
      activeProjectId, activeProjectFiles, setActiveProject,
      localRootHandle, localFileTree, openDirectory, openLocalFile,
      teams, isLoadingTeams, fetchTeams, createTeam, createProject, 
      currentUser, joinTeam, broadcastCursor, cursors,
      terminalOpen, terminalOutput, runCode, predictOutput, closeTerminal, sendTerminalCommand,
      sidebarLeftWidth, setSidebarLeftWidth, sidebarRightWidth, setSidebarRightWidth, terminalHeight, setTerminalHeight,
      isGuest, login, logout, continueAsGuest,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
