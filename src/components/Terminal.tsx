import { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { Plus, ChevronDown, MoreHorizontal, Maximize2, Minimize2, X } from 'lucide-react';

export default function Terminal() {
  const { 
    terminalOpen, terminalOutput, closeTerminal, sendTerminalCommand,
    terminalHeight, setTerminalHeight 
  } = useApp();
  
  const [inputValue, setInputValue] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendTerminalCommand(inputValue);
      setInputValue('');
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  // Resize logic
  const startResizing = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    document.body.style.userSelect = 'none';
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    const newHeight = window.innerHeight - e.clientY;
    // Limit height between 100px and 80% of window
    setTerminalHeight(Math.max(100, Math.min(newHeight, window.innerHeight * 0.8)));
  }, [isResizing, setTerminalHeight]);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    document.body.style.userSelect = 'auto';
  }, []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', stopResizing);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stopResizing);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, onMouseMove, stopResizing]);

  if (!terminalOpen) return null;

  return (
    <div 
      className={`terminal-window ${isMaximized ? 'maximized' : ''} ${isResizing ? 'resizing' : ''}`} 
      style={!isMaximized ? { height: terminalHeight } : {}}
      onClick={focusInput}
    >
      <div className={`resize-handle-h ${isResizing ? 'dragging' : ''}`} onMouseDown={startResizing} />
      
      <div className="terminal-header">
        <div className="terminal-tabs">
          <div className="terminal-tab">Problems <span className="tab-badge">0</span></div>
          <div className="terminal-tab">Output</div>
          <div className="terminal-tab">Debug Console</div>
          <div className="terminal-tab active">Terminal</div>
          <div className="terminal-tab">Ports</div>
        </div>
        
        <div className="terminal-actions">
          <div className="action-btn"><Plus size={14}/></div>
          <div className="action-btn"><ChevronDown size={14}/></div>
          <div className="action-btn"><MoreHorizontal size={14}/></div>
          <div className="action-btn" onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }} title={isMaximized ? "Restore" : "Enlarge"}>
            {isMaximized ? <Minimize2 size={14}/> : <Maximize2 size={14}/>}
          </div>
          <div className="action-btn close" onClick={(e) => { e.stopPropagation(); closeTerminal(); }} title="Close">
            <X size={14}/>
          </div>
        </div>
      </div>
      
      <div className="terminal-body" ref={bodyRef}>
        {terminalOutput.map((line, i) => (
          <div key={i} className="terminal-line">{line}</div>
        ))}
        <div className="terminal-interactive-row">
          <span className="terminal-prompt">C:\HiveHub\projects&gt;</span>
          <input 
            ref={inputRef}
            className="terminal-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
