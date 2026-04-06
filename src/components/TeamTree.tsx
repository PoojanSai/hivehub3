import { useState } from 'react';
import {
  ChevronRight, ChevronDown, Users, Folder, Star,
  GitFork, Eye, CheckCircle2, AlertTriangle,
} from 'lucide-react';
import type { Team, Project, Version } from '@/types';
import { useApp } from '@/context/AppContext';

/* ── Version row ── */
interface VersionRowProps { version: Version; }
function VersionRow({ version }: VersionRowProps) {
  const { loadVersion } = useApp();
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  const tag = version.tag ?? '';
  const label = version.label ?? '';

  // Format created_at as relative date for display
  function relDate(iso: string): string {
    try {
      const diff = Date.now() - new Date(iso).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      const days = Math.floor(hrs / 24);
      if (days < 30) return `${days}d ago`;
      return `${Math.floor(days / 30)}mo ago`;
    } catch {
      return '';
    }
  }

  async function handleView() {
    setLoading(true);
    try {
      await loadVersion(version.id);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`version-row ${hovered ? 'hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="ver-icon">
        {version.stable
          ? <CheckCircle2 size={11} color="#34d399"/>
          : <AlertTriangle size={11} color="#fbbf24"/>}
      </span>
      <span className="ver-tag">{tag}</span>
      <span className="ver-label">{label}</span>
      {version.created_at && (
        <span className="ver-date">{version.date ?? relDate(version.created_at)}</span>
      )}
      {hovered && (
        <div className="ver-actions">
          <button
            className="ver-btn"
            onClick={handleView}
            disabled={loading}
            title="Load this version in editor"
          >
            <Eye size={10}/> {loading ? '…' : 'View'}
          </button>
          <button className="ver-btn fork" title="Fork this version">
            <GitFork size={10}/> Fork
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Project row ── */
interface ProjectRowProps { project: Project; }
function ProjectRow({ project }: ProjectRowProps) {
  const { setActiveProject } = useApp();
  const [open, setOpen] = useState(false);
  const versions = project.versions ?? [];

  async function handleToggle() {
    const next = !open;
    setOpen(next);
    if (next) {
      await setActiveProject(project.id);
    }
  }

  return (
    <div className="project-block">
      <button className="project-row" onClick={handleToggle}>
        <span className="proj-chevron">
          {open ? <ChevronDown size={11}/> : <ChevronRight size={11}/>}
        </span>
        <Folder size={12} color="#60a5fa" className="proj-icon"/>
        <span className="proj-name">{project.name}</span>
        <span className="lang-badge">{project.lang}</span>
        <span className="star-count"><Star size={9}/>{project.stars}</span>
      </button>
      {open && (
        <div className="versions-list">
          {versions.length === 0 && (
            <div style={{ padding: '4px 12px', color: '#64748b', fontSize: 11 }}>No versions</div>
          )}
          {versions.map(v => <VersionRow key={v.id} version={v}/>)}
        </div>
      )}
    </div>
  );
}

/* ── Team row ── */
interface TeamRowProps { team: Team; }
function TeamRow({ team }: TeamRowProps) {
  const [open, setOpen] = useState(false);
  const projects = team.projects ?? [];

  return (
    <div className="team-block">
      <button className="team-row" onClick={() => setOpen(v => !v)}>
        <span className="team-chevron">
          {open ? <ChevronDown size={12}/> : <ChevronRight size={12}/>}
        </span>
        <div
          className="team-icon"
          style={{ background: team.color + '22', border: `1px solid ${team.color}44` }}
        >
          <Users size={11} color={team.color}/>
        </div>
        <span className="team-name">{team.name}</span>
        {team.join_code && (
          <span className="join-code-badge" title="Team Invitation Code">{team.join_code}</span>
        )}
        <span className="member-badge" style={{ color: team.color }}>{team.members}</span>
      </button>
      {open && (
        <div className="projects-list">
          {projects.length === 0 && (
            <div style={{ padding: '4px 16px', color: '#64748b', fontSize: 11 }}>No projects</div>
          )}
          {projects.map(p => <ProjectRow key={p.id} project={p}/>)}
        </div>
      )}
    </div>
  );
}

/* ── Tree root ── */
interface TeamTreeProps { teams: Team[]; }
export default function TeamTree({ teams }: TeamTreeProps) {
  const safeTeams = teams ?? [];
  return (
    <div className="team-tree">
      {safeTeams.map(t => <TeamRow key={t.id} team={t}/>)}
    </div>
  );
}
