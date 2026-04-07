import { X, Terminal as TerminalIcon } from 'lucide-react';

interface TerminalPanelProps {
  onClose: () => void;
  isOpen: boolean;
}

export default function TerminalPanel({ onClose, isOpen }: TerminalPanelProps) {
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out font-mono flex flex-col shadow-2xl"
      style={{ 
        height: '30vh', 
        minHeight: '200px',
        backgroundColor: 'var(--bg0)',
        borderTop: '1px solid var(--border)',
        transform: isOpen ? 'translateY(0)' : 'translateY(100%)'
      }}
    >
      <div 
        className="flex items-center justify-between px-4 py-2"
        style={{
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--bg1)'
        }}
      >
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text1)' }}>
          <TerminalIcon size={14} />
          <span>Output</span>
        </div>
        <button 
          onClick={onClose}
          className="transition-colors hover:text-white"
          style={{ color: 'var(--text2)' }}
          title="Close terminal"
        >
          <X size={16} />
        </button>
      </div>
      <div className="p-4 flex-1 overflow-y-auto text-[13px] leading-relaxed" style={{ color: 'var(--text0)' }}>
        <div style={{ color: 'var(--green)' }}>{'>'} Running code...</div>
        <div style={{ color: 'var(--orange)', marginTop: '4px' }}>{'>'} Output:</div>
        <div style={{ marginTop: '4px', color: '#c5d1e0' }}>Hello World</div>
      </div>
    </div>
  );
}
