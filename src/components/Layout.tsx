import { useState, useCallback } from 'react';
import Navbar from './Navbar';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import EditorPanel from './EditorPanel';
import Terminal from './Terminal';
import { useApp } from '@/context/AppContext';

export default function Layout() {
  const { sidebarLeftWidth, setSidebarLeftWidth, sidebarRightWidth, setSidebarRightWidth } = useApp();
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (isResizingLeft) {
      const newWidth = Math.max(160, Math.min(450, e.clientX));
      setSidebarLeftWidth(newWidth);
    }
    if (isResizingRight) {
      const newWidth = Math.max(160, Math.min(450, window.innerWidth - e.clientX));
      setSidebarRightWidth(newWidth);
    }
  }, [isResizingLeft, isResizingRight, setSidebarLeftWidth, setSidebarRightWidth]);

  const stopResizing = useCallback(() => {
    setIsResizingLeft(false);
    setIsResizingRight(false);
    document.body.style.userSelect = 'auto';
  }, []);

  const handleStartResizingLeft = useCallback(() => {
    setIsResizingLeft(true);
    document.body.style.userSelect = 'none';
  }, []);

  const handleStartResizingRight = useCallback(() => {
    setIsResizingRight(true);
    document.body.style.userSelect = 'none';
  }, []);

  return (
    <div 
      className="app-shell"
      onMouseMove={onMouseMove}
      onMouseUp={stopResizing}
      onMouseLeave={stopResizing}
    >
      <Navbar/>
      <div className="app-body">
        <div style={{ width: sidebarLeftWidth, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <SidebarLeft/>
        </div>
        <div className={`resize-handle-v ${isResizingLeft ? 'dragging' : ''}`} onMouseDown={handleStartResizingLeft} />
        
        <main className="app-main" style={{ position: 'relative' }}>
          <EditorPanel/>
          <Terminal />
        </main>

        <div className={`resize-handle-v ${isResizingRight ? 'dragging' : ''}`} onMouseDown={handleStartResizingRight} />
        <div style={{ width: sidebarRightWidth, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <SidebarRight/>
        </div>
      </div>
    </div>
  );
}
