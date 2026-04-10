import { useState } from 'react';
import { Search, FilePlus, FolderPlus, HardDrive, RefreshCw, FolderOpen, Loader2 } from 'lucide-react';
import FileTree from './FileTree';
import { useApp } from '@/context/AppContext';

export default function SidebarLeft() {
  const { 
    activeProjectFiles, activeProjectId, 
    localFileTree, openDirectory 
  } = useApp();
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleOpenFolder() {
    setLoading(true);
    try {
      await openDirectory();
    } finally {
      setLoading(false);
    }
  }

  const rootNode = localFileTree || (activeProjectId ? {
    id: 'root',
    name: `Project #${activeProjectId}`,
    type: 'folder' as const,
    open: true,
    children: activeProjectFiles.map(f => ({
      id: `file-${f.id}`,
      name: f.name,
      type: 'file' as const,
      ext: f.name.split('.').pop() || '',
      sz: '?',
      m: 'Backend',
      fileId: f.id
    }))
  } : null);

  return (
    <aside className="sidebar sidebar-left">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-title">
          <HardDrive size={12}/>
          <span>{activeProjectId ? 'Project Explorer' : 'Local Workspace'}</span>
        </div>
        <div className="sidebar-actions">
          <button className="icon-btn-sm" title="Open Local Folder" onClick={handleOpenFolder}>
            {loading ? <Loader2 size={13} className="animate-spin"/> : <FolderOpen size={13}/>}
          </button>
          <button 
            className="icon-btn-sm" 
            title="New File"
            onClick={() => {
              const name = prompt("Enter file name");
              if (!name) return;
             console.log("Create file:", name);
            }}
          >
            <FilePlus size={13}/>
          </button>
          <button className="icon-btn-sm" title="New Folder"><FolderPlus size={13}/></button>
          <button className="icon-btn-sm" title="Refresh"><RefreshCw size={12}/></button>
        </div>
      </div>

      {/* Search */}
      <div className="sidebar-search">
        <Search size={11}/>
        <input
          placeholder="Filter files…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>

      {/* Tree */}
      <div className="sidebar-scroll">
        {!localFileTree && (
          <div style={{ padding: '16px', borderBottom: activeProjectId ? '1px solid var(--border)' : 'none' }}>
            {(!activeProjectId && !localFileTree) && (
              <p style={{ color: '#64748b', fontSize: 11, fontStyle: 'italic', marginBottom: 12, textAlign: 'center' }}>
                No files loaded 🚫  
                Click "Open Folder" to start coding
              </p>
            )}
            <button className="upload-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={handleOpenFolder}>
              <FolderOpen size={12}/>
              <span>Open Local Folder</span>
            </button>
            {activeProjectId && !localFileTree && (
              <p style={{ color: '#64748b', fontSize: 10, marginTop: 10, textAlign: 'center' }}>
                Currently viewing cloud project
              </p>
            )}
          </div>
        )}

        {rootNode && (
          <div className="sidebar-content">
            <div className="workspace-root">
              <span className="root-name">{rootNode.name}</span>
            </div>
            <FileTree root={rootNode} filter={filter}/>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <span>{activeProjectFiles.length} files</span>
        <div className="sync-status">
          <span className="sync-dot"/>
          <span>Synced</span>
        </div>
      </div>
    </aside>
  );
}
