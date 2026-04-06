import Navbar from './Navbar';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import EditorPanel from './EditorPanel';

export default function Layout() {
  return (
    <div className="app-shell">
      <Navbar/>
      <div className="app-body">
        <SidebarLeft/>
        <main className="app-main">
          <EditorPanel/>
        </main>
        <SidebarRight/>
      </div>
    </div>
  );
}
