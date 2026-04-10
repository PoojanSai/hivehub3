import { useState } from 'react';
import { X, Users, FolderPlus, ArrowLeft, Check, Loader2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface Props {
  onClose: () => void;
}

type Step = 'select-team' | 'create-team' | 'project-details';

export default function CreateProjectModal({ onClose }: Props) {
  const { teams, createTeam, createProject } = useApp();
  const [step, setStep] = useState<Step>('select-team');
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  
  // Form states
  const [teamName, setTeamName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectLang, setProjectLang] = useState('TypeScript');
  const [loading, setLoading] = useState(false);

  async function handleCreateTeam() {
    if (loading) return;
    if (!teamName.trim()) return;
    setLoading(true);
    try {
      const team = await createTeam(teamName, '#2dd4bf');
      if (team && team.id) {
        setSelectedTeamId(team.id);
        setStep('project-details');
        setTeamName('');
      } else {
        alert('Failed to create team: Invalid response from server');
      }
    } catch (err: any) {
      console.error(err);
      alert('Error creating team: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateProject() {
    if (loading) return;
    if (!projectName.trim() || !selectedTeamId) return;
    setLoading(true);
    try {
      await createProject(projectName, projectLang, selectedTeamId);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content project-modal">
        <div className="modal-header">
          <h2>
            {step === 'select-team' && 'Select Team'}
            {step === 'create-team' && 'Create New Team'}
            {step === 'project-details' && 'Project Details'}
          </h2>
          <button className="icon-btn-sm" onClick={onClose}><X size={16}/></button>
        </div>

        <div className="modal-body">
          {step === 'select-team' && (
            <div className="team-selector">
              <p className="modal-sub">Choose a team for your new project</p>
              <div className="team-grid">
                {teams.map(team => (
                  <div 
                    key={team.id} 
                    className={`team-card ${selectedTeamId === team.id ? 'selected' : ''}`}
                    onClick={() => setSelectedTeamId(team.id)}
                  >
                    <div className="team-card-icon" style={{ background: team.color + '22', color: team.color }}>
                      <Users size={16}/>
                    </div>
                    <div className="team-card-info">
                      <span className="team-name">{team.name}</span>
                      <span className="team-meta">{team.members} members</span>
                    </div>
                    {selectedTeamId === team.id && <Check size={14} className="check-icon"/>}
                  </div>
                ))}
                <div className="team-card create-new" onClick={() => setStep('create-team')}>
                  <div className="team-card-icon"><FolderPlus size={16}/></div>
                  <div className="team-card-info">
                    <span className="team-name">New Team</span>
                    <span className="team-meta">Start fresh</span>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn-primary" 
                  disabled={!selectedTeamId}
                  onClick={() => setStep('project-details')}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 'create-team' && (
            <div className="form-step">
              <button className="back-link" onClick={() => setStep('select-team')}>
                <ArrowLeft size={12}/> Back to selection
              </button>
              <div className="form-group">
                <label>Team Name</label>
                <input 
  autoFocus
  placeholder="e.g. Design System Team" 
  value={teamName}
  onChange={e => setTeamName(e.target.value)}
  disabled={loading}
  onKeyDown={(e) => {
    if (e.key === 'Enter') handleCreateTeam();
  }}
/>
              </div>
              <div className="modal-footer">
                <button 
  className="btn-primary" 
  onClick={handleCreateTeam} 
  disabled={loading || !teamName.trim()}
>
                  {loading ? <Loader2 size={14} className="animate-spin"/> : 'Create Team & Continue'}
                </button>
              </div>
            </div>
          )}

          {step === 'project-details' && (
            <div className="form-step">
              <button className="back-link" onClick={() => setStep('select-team')}>
                <ArrowLeft size={12}/> Change Team
              </button>
              <div className="form-group">
                <label>Project Name</label>
                <input 
  autoFocus
  placeholder="e.g. HiveHub Pro" 
  value={projectName}
  onChange={e => setProjectName(e.target.value)}
  disabled={loading}
  onKeyDown={(e) => {
    if (e.key === 'Enter') handleCreateProject();
  }}
/>
              </div>
              <div className="form-group">
                <label>Language / Stack</label>
                <select 
  value={projectLang} 
  onChange={e => setProjectLang(e.target.value)}
  disabled={loading}
>
                  <option>TypeScript</option>
                  <option>Python</option>
                  <option>Go</option>
                  <option>Rust</option>
                </select>
              </div>
              <div className="modal-footer">
                <button 
  className="btn-primary" 
  onClick={handleCreateProject} 
  disabled={loading || !projectName.trim()}
>
                  {loading ? <Loader2 size={14} className="animate-spin"/> : 'Create Project'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
