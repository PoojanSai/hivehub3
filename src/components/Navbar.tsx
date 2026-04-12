import { useState, useRef, useEffect } from 'react';
import { Bell, Settings, Search, Command, GitBranch, ChevronDown, User as UserIcon, LogOut, LogIn } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { currentUser, isGuest, logout, predictOutput } = useApp();
  const [searchFocused] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    function clickAway(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', clickAway);
    return () => document.removeEventListener('mousedown', clickAway);
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const curInitial = currentUser ? getInitials(currentUser.name) : '??';

  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo" style={{ textDecoration: 'none' }}>
        <div className="logo-hex">
          <svg viewBox="0 0 40 46" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="28">
            <path d="M20 1L38 11.5V34.5L20 45L2 34.5V11.5L20 1Z"
              fill="url(#hexGrad)" stroke="#2dd4bf" strokeWidth="1.5"/>
            <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
              fill="white" fontSize="14" fontWeight="700" fontFamily="JetBrains Mono">H</text>
            <defs>
              <linearGradient id="hexGrad" x1="2" y1="1" x2="38" y2="45" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0f2027"/>
                <stop offset="1" stopColor="#1a1f2e"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span className="logo-text">HIVEHUB</span>
        <div className="logo-badge">BETA</div>
      </Link>

      <nav className="navbar-nav">
        {[
          { name: 'Dashboard', path: '/dashboard' },
          { name: 'Editor', path: '/' },
          { name: 'Teams', path: '/teams' },
          { name: 'Activity', path: '/activity' }
        ].map((item) => (
          <Link 
            key={item.name} 
            to={item.path} 
            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className={`navbar-search ${searchFocused ? 'focused' : ''}`}>
        <Search size={13} className="search-icon" />
        <input 
          placeholder="Search anything..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              console.log('Search:', (e.target as HTMLInputElement).value);
            }
          }}
        />
        <div className="search-kbd">
          <Command size={10}/><span>K</span>
        </div>
      </div>

      <div className="navbar-actions">
        <button className="run-btn" onClick={predictOutput}>
          ▶ Run
        </button>

        <button className="icon-btn" title="Branch">
          <GitBranch size={15}/>
          <span className="branch-label">main</span>
        </button>
        <button className="icon-btn notif" title="Notifications">
          <Bell size={15}/>
          <span className="notif-dot"/>
        </button>
        <button className="icon-btn" title="Settings">
          <Settings size={15}/>
        </button>
        
        {isGuest ? (
          <button className="btn-primary" style={{ padding: '6px 12px', height: 32, fontSize: 11 }} onClick={logout}>
            <LogIn size={13} style={{ marginRight: 6 }}/> Sign In
          </button>
        ) : (
          <div className="profile-container" ref={dropdownRef}>
            <div 
              className={`profile-trigger ${profileOpen ? 'active' : ''}`} 
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className="user-avatar">
                <span>{curInitial}</span>
              </div>
              <ChevronDown size={12} className={`chevron ${profileOpen ? 'up' : ''}`} />
            </div>

            {profileOpen && currentUser && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <span className="dropdown-title">MY ACCOUNT</span>
                </div>
                <div className="user-item active" style={{ cursor: 'default' }}>
                  <div className="user-item-avatar">
                    {curInitial}
                  </div>
                  <div className="user-item-info">
                    <span className="user-item-name">{currentUser.name}</span>
                    <span className="user-item-email">{currentUser.email}</span>
                  </div>
                </div>
                <div className="dropdown-footer">
                  <button className="dropdown-opt"><UserIcon size={12}/> View Profile</button>
                  <button className="dropdown-opt" style={{ color: 'var(--red)' }} onClick={logout}>
                    <LogOut size={12}/> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
