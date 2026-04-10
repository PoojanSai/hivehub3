import { useState, useRef, useEffect } from 'react';
import {
  X, MessageSquare, GitBranch, Save, Globe,
  FolderOpen, Plus, Terminal, Loader2, Users,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Editor from '@monaco-editor/react';
import CreateProjectModal from './CreateProjectModal';
import JoinTeamModal from './JoinTeamModal';

/* ── Syntax Highlighting ── */
// const KEYWORDS = /\b(import|export|default|from|const|let|var|function|return|if|else|for|while|class|extends|interface|type|async|await|new|this|void|null|undefined|true|false|in|of|as|typeof|keyof|implements|readonly)\b/g;
// const STRINGS  = /(["`'])(?:(?!\1)[^\\]|\\.)*\1/g;
// const JSX_TAGS = /(<\/?[A-Z][A-Za-z0-9.]*|<\/?[a-z][a-z0-9-]*)/g;
// const NUMBERS  = /\b(\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw)?)\b/g;
// const TYPES_RE = /\b([A-Z][A-Za-z0-9]*)\b/g;



/* ── Welcome Screen ── */
function WelcomeView() {
  const { openFile } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  function handleOpen() {
    openFile({ id: 'App.tsx', name: 'App.tsx', ext: 'tsx', sz: '4.2 KB', m: '2m ago' });
  }

  return (
    <div className="welcome-view">
      {showModal && <CreateProjectModal onClose={() => setShowModal(false)} />}
      {showJoinModal && <JoinTeamModal onClose={() => setShowJoinModal(false)} />}
      <div className="welcome-bg">
        <div className="orb orb1"/>
        <div className="orb orb2"/>
        <svg className="hex-grid" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
          {Array.from({ length: 80 }, (_, i) => {
            const col = i % 10, row = Math.floor(i / 10);
            const x = col * 62 + (row % 2 === 0 ? 0 : 31);
            const y = row * 54;
            return (
              <path key={i}
                d={`M${x+18},${y} L${x+36},${y+9} L${x+36},${y+27} L${x+18},${y+36} L${x},${y+27} L${x},${y+9}Z`}
                fill="none" stroke="rgba(45,212,191,0.04)" strokeWidth="1"/>
            );
          })}
        </svg>
      </div>

      <div className="welcome-content">
        <div className="welcome-logo">
          <svg viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg" width="60" height="70">
            <path d="M30 2L57 17.5V52.5L30 68L3 52.5V17.5L30 2Z"
              fill="url(#wg)" stroke="#2dd4bf" strokeWidth="2"/>
            <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
              fill="white" fontSize="22" fontWeight="700" fontFamily="JetBrains Mono">H</text>
            <defs>
              <linearGradient id="wg" x1="3" y1="2" x2="57" y2="68" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0f2027"/>
                <stop offset="1" stopColor="#1a2535"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1 className="welcome-title">HIVEHUB</h1>
        <p className="welcome-sub">Real-time collaborative coding. Isolated environments. Zero conflicts.</p>

        <div className="welcome-stats">
          {[['12,400+', 'Teams'], ['98.9%', 'Uptime'], ['&lt;50ms', 'Latency'], ['0', 'Merge Conflicts']].map(([n, l]) => (
            <div key={l} className="wstat">
              <span className="wstat-num" dangerouslySetInnerHTML={{ __html: n }}/>
              <span className="wstat-label">{l}</span>
            </div>
          ))}
        </div>

        <div className="welcome-actions">
          <button className="btn-primary" onClick={handleOpen}>
            <FolderOpen size={14}/> Open Project
          </button>
          <button className="btn-ghost" onClick={() => setShowModal(true)}>
            <Plus size={14}/> Create Project
          </button>
          <button className="btn-ghost" onClick={() => setShowJoinModal(true)}>
            <Users size={14}/> Join Team
          </button>
        </div>

        <div className="welcome-hints">
          <div className="hint"><Terminal size={11}/><span>Press <kbd>/</kbd> to search</span></div>
          <div className="hint"><Globe size={11}/><span>Auto-synced to cloud</span></div>
        </div>
      </div>
    </div>
  );
}

/* ── Editor View ── */
const TAB_COLORS: Record<string, string> = {
  tsx: '#2dd4bf', ts: '#3b82f6', js: '#fbbf24', css: '#a78bfa',
  json: '#fb923c', html: '#ef4444', md: '#94a3b8',
  go: '#06b6d4', rs: '#fb923c', py: '#84cc16', tf: '#8b5cf6',
};

function EditorView() {
  const {
    tabs, activeTabId, closeTab, setActiveTab,
    chatOpen, toggleChat, messages, sendMessage,
    saveVersion, updateTabContent, 
  } = useApp();
  const [showTerminal, setShowTerminal] = useState(false);
  const activeTab = tabs.find(t => t.id === activeTabId);

  // The displayed lines — use tab content if available, else empty
  const lines = (activeTab?.content ?? '').split('\n');

  const [inputMsg, setInputMsg] = useState('');
  const [cursorLine] = useState(1);
  const [cursorCol] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saveTag, setSaveTag] = useState('');
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend() {
    if (!inputMsg.trim()) return;
    sendMessage(inputMsg);
    setInputMsg('');
  }

  // function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
  //   if (activeTabId) updateTabContent(activeTabId, e.target.value);
  // }



  async function handleSave() {
    if (!activeTabId || !activeTab?.fileId) {
      // Tab has no backend fileId — just mark clean
      return;
    }
    const tag = saveTag.trim() || `v-${Date.now()}`;
    setSaving(true);
    try {
      await saveVersion(activeTabId, activeTab.content ?? '', tag);
    } finally {
      setSaving(false);
      setShowSavePrompt(false);
      setSaveTag('');
    }
  }

  return (
    <div className="editor-view">
      {/* Tab bar */}
      <div className="tab-bar">
        <div className="tabs-list">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTabId === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-dot" style={{ background: TAB_COLORS[tab.ext] ?? '#64748b' }}/>
              <span>{tab.name}</span>
              {tab.isDirty && <span className="tab-dirty">●</span>}
              <span className="tab-close" onClick={e => { e.stopPropagation(); closeTab(tab.id); }}>
                <X size={10}/>
              </span>
            </button>
          ))}
        </div>
        <div className="tab-bar-right">
          <button className={`chat-toggle ${chatOpen ? 'active' : ''}`} onClick={toggleChat} title="Team Chat">
            <MessageSquare size={13}/>
            <span className="chat-badge">3</span>
          </button>
        </div>
      </div>

      {/* Info bar */}
      {activeTab && (
        <div className="info-bar">
          <div className="info-left">
            <GitBranch size={11}/><span className="info-branch">main</span>
            <span className="info-sep">›</span>
            <span className="info-file">{activeTab.name}</span>
            <span className="lang-tag">{activeTab.ext.toUpperCase()}</span>
            {activeTab.versionId && (
              <span className="info-meta">version #{activeTab.versionId}</span>
            )}
          </div>
          <div className="info-right">
            <span className="info-meta">{lines.length} lines</span>
            {showSavePrompt ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input
                  placeholder="version tag…"
                  value={saveTag}
                  onChange={e => setSaveTag(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSave()}
                  style={{
                    background: '#0d1b2a', border: '1px solid #2dd4bf55', borderRadius: 4,
                    color: '#e2e8f0', fontSize: 11, padding: '2px 6px', width: 120,
                  }}
                  autoFocus
                />
                <button className="save-btn" onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 size={10} style={{ animation: 'spin 1s linear infinite' }}/> : <Save size={10}/>}
                  {saving ? 'Saving…' : 'Confirm'}
                </button>
                <button className="save-btn" onClick={() => setShowSavePrompt(false)} style={{ opacity: 0.6 }}>
                  Cancel
                </button>
              </span>
            ) : (
              <button
                className="save-btn"
                onClick={() => activeTab.fileId ? setShowSavePrompt(true) : undefined}
                title={activeTab.fileId ? 'Save as new version' : 'No backend file linked'}
              >
                <Save size={10}/>
                {activeTab.isDirty ? 'Save*' : 'Save'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="editor-main">
        {/* Code area */}
        <div className={`code-area ${chatOpen ? 'chat-open' : ''}`}>
          {activeTab ? (
            <div className="code-scroll" style={{ position: 'relative' }}>
              {/* Syntax-highlighted display layer */}
 

              {/* Remote Cursors layer */}


              {/* Actual editable textarea — transparent, sits on top */}

            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', fontSize: 13 }}>
              Select a file or version to view its content
            </div>
          )}
        </div>
        <Editor
  height="100%"
language={
  activeTab?.ext === 'tsx' ? 'typescript' :
  activeTab?.ext === 'ts' ? 'typescript' :
  activeTab?.ext === 'js' ? 'javascript' :
  activeTab?.ext === 'py' ? 'python' :
  'javascript'
}  value={activeTab?.content || ""}
  onChange={(value) => {
    if (activeTabId && value !== undefined) {
      updateTabContent(activeTabId, value);
    }
  }}
  theme="vs-dark"
/>

        {/* Chat panel */}
        {chatOpen && (
          <div className="chat-panel">
            <div className="chat-header">
              <MessageSquare size={11}/>
              <span>Team Chat</span>
              <span className="chat-live">● LIVE</span>
            </div>
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className="chat-msg">
                  <span className="msg-avatar" style={{ background: msg.color + '33', color: msg.color }}>
                    {msg.userId === 'me' ? 'Y' : msg.color === '#a78bfa' ? 'A' : msg.color === '#34d399' ? 'R' : 'M'}
                  </span>
                  <div className="msg-body">
                    <span className="msg-name" style={{ color: msg.color }}>{msg.userName}</span>
                    <p className="msg-text">{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef}/>
            </div>
            <div className="chat-input-row">
              <input
                value={inputMsg}
                onChange={e => setInputMsg(e.target.value)}
                placeholder="Message…"
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <button onClick={handleSend}>↑</button>
            </div>
          </div>
        )}
      </div>
      {showTerminal && (
        <div className="terminal-box">
          <div className="terminal-header">
            <span>Output</span>
            <button onClick={() => setShowTerminal(false)}>X</button>
          </div>
          <div className="terminal-body">
            AI Output will come here...
          </div>
        </div>
      )}

      {/* Status bar */}
      <div className="status-bar">
        <div className="status-left">
          <span className="status-item branch"><GitBranch size={10}/> main</span>
          <span className="status-item">Ln {cursorLine}, Col {cursorCol}</span>
          <span className="status-item">UTF-8</span>
        </div>
        <div className="status-right">
          <span className="status-item lang">{activeTab?.ext?.toUpperCase() ?? 'TSX'}</span>
        </div>
      </div>
    </div>
  );
}

export default function EditorPanel() {
  const { viewMode, tabs } = useApp();
  const showEditor = viewMode === 'editor' && tabs.length > 0;
  return showEditor ? <EditorView/> : <WelcomeView/>;
}
