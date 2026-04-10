import Navbar from './Navbar';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import EditorPanel from './EditorPanel';
import Terminal from './Terminal';

export default function Layout() {
  return (
    <div className="app-shell">
      <Navbar/>
      <div className="app-body">
        <SidebarLeft/>
        <main className="app-main" style={{ position: 'relative' }}>
          <EditorPanel/>
          <Terminal />
        </main>
        <SidebarRight/>
      </div>
    </div>
  );
}
