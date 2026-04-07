import { useState } from 'react';
import Navbar from './Navbar';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import EditorPanel from './EditorPanel';
import TerminalPanel from './TerminalPanel';

export default function Layout() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  return (
    <div className="app-shell relative">
      <Navbar onRunClick={() => setIsTerminalOpen(true)} />
      <div className="app-body">
        <SidebarLeft/>
        <main className="app-main">
          <EditorPanel/>
        </main>
        <SidebarRight/>
      </div>
      <TerminalPanel isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
    </div>
  );
}
