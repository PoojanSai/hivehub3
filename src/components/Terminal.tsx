import { useApp } from '@/context/AppContext';

export default function Terminal() {
  const { terminalOpen, terminalOutput, closeTerminal } = useApp();

  if (!terminalOpen) return null;

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '250px',
      backgroundColor: '#0f172a',
      borderTop: '1px solid #334155',
      color: '#e2e8f0',
      fontFamily: 'monospace',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 16px',
        backgroundColor: '#1e293b',
        borderBottom: '1px solid #334155',
      }}>
        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Terminal</span>
        <button 
          onClick={closeTerminal}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            fontSize: '14px',
            padding: '4px',
          }}
          title="Close terminal"
        >
          ✖
        </button>
      </div>
      <div style={{ padding: '16px', overflowY: 'auto', flex: 1, whiteSpace: 'pre-wrap' }}>
        {terminalOutput.map((line, i) => (
          <div key={i} style={{ minHeight: '1.2em' }}>{line}</div>
        ))}
      </div>
    </div>
  );
}
