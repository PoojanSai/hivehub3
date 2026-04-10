import { useState } from 'react';
import { X, Hash, ArrowRight, Loader2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface Props {
  onClose: () => void;
}

export default function JoinTeamModal({ onClose }: Props) {
  const { joinTeam } = useApp();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleJoin() {
    if (loading) return;
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await joinTeam(code.trim().toUpperCase());
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Invalid code or already joined');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content project-modal" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h2>Join Team</h2>
          <button className="icon-btn-sm" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="modal-body">
          <p className="modal-sub">Enter the unique team code to collaborate with others.</p>

          <div className="form-group">
            <label>Team Invitation Code</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text2)' }}>
                <Hash size={14} />
              </div>
              <input 
    autoFocus
  placeholder="e.g. HH-XJ9A2" 
  value={code}
  onChange={e => setCode(e.target.value.toUpperCase())}
  disabled={loading}
  onKeyDown={(e) => {
    if (e.key === 'Enter') handleJoin();
  }}
  style={{ paddingLeft: '34px', letterSpacing: '0.05em', textTransform: 'uppercase' }}
/>
            </div>
          </div>

          {error && (
            <div style={{ fontSize: 11, color: 'var(--red)', marginTop: -8, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <div className="modal-footer">
            <button
              className="btn-primary"
              onClick={handleJoin}
              disabled={loading || !code.trim()}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Join Team <ArrowRight size={14} />
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
