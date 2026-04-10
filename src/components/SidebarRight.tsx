import { Upload, Cloud, Loader2 } from 'lucide-react';
import TeamTree from './TeamTree';
import { useApp } from '@/context/AppContext';

export default function SidebarRight() {
  const { teams, isLoadingTeams } = useApp();

  const totalProjects = teams.reduce((a, t) => a + (t.projects?.length ?? 0), 0);
  const totalVersions = teams.reduce(
    (a, t) => a + (t.projects?.reduce((b: number, p: any) => b + (p.versions?.length ?? 0), 0) ?? 0),
    0
  );
const used = 2.4;
const total = 10;
const percent = (used / total) * 100;
  return (
    <aside className="sidebar sidebar-right">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-title">
          <Cloud size={12}/>
          <span>Cloud Projects</span>
        </div>
        <button 
          className="upload-btn"
          onClick={() => {
            console.log("Upload project clicked");
          }}
        >
          <Upload size={11}/>
          <span>Upload</span>
        </button>
      </div>

      {/* Stats row */}
      
      <div className="cloud-stats">
        <div className="cloud-stat">
          <span className="stat-num">{isLoadingTeams ? '…' : teams.length}</span>
          <span className="stat-label">Teams</span>
        </div>
        <div className="cloud-stat">
          <span className="stat-num">{isLoadingTeams ? '…' : totalProjects}</span>
          <span className="stat-label">Projects</span>
        </div>
        <div className="cloud-stat">
          <span className="stat-num">{isLoadingTeams ? '…' : totalVersions}</span>
          <span className="stat-label">Versions</span>
        </div>
        
      </div>
      <div style={{ padding: 10, fontSize: 11, color: '#64748b' }}>
        Last sync: just now
      </div>
      

      {/* Tree */}
      <div className="sidebar-scroll">
        {isLoadingTeams && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 16px', color: '#64748b', fontSize: 12 }}>
            <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }}/>
            Loading teams…
          </div>
        )}
        {!isLoadingTeams && teams.length === 0 && (
          <div style={{ padding: '12px 16px', color: '#64748b', fontSize: 12 }}>
            No teams found.
          </div>
        )}
        {!isLoadingTeams && teams.length > 0 && (
          <TeamTree teams={teams}/>
        )}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="storage-bar">
          <div className="storage-label">
            <span>Storage</span>
            <span>{used} GB / {total} GB</span>
          </div>
          <div className="storage-track">
            <div className="storage-fill" style={{ width: `${percent}%` }}/>
          </div>
        </div>
      </div>
    </aside>
  );
}
