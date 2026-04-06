import { useState, useRef, useEffect } from 'react';
import { Bell, Settings, Search, Command, GitBranch, ChevronDown, User as UserIcon } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const MOCK_USERS = [
  { id: 4, name: 'You',      email: 'you@hivehub.dev', initials: 'EK' },
  { id: 1, name: 'Aisha K.', email: 'aisha@hivehub.dev', initials: 'AK' },
  { id: 2, name: 'Rajan M.', email: 'rajan@hivehub.dev', initials: 'RM' },
  { id: 3, name: 'Mei L.',   email: 'mei@hivehub.dev',   initials: 'ML' },
];

export default function Navbar() {
  const { currentUser, setCurrentUser } = useApp();
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function clickAway(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', clickAway);
    return () => document.removeEventListener('mousedown', clickAway);
  }, []);

  const curInitial = MOCK_USERS.find(u => u.id === currentUser.id)?.initials || '??';

  return (
    <header className="navbar">
      <div className="navbar-logo">
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
      </div>

      <nav className="navbar-nav">
        {['Dashboard', 'Projects', 'Teams', 'Activity'].map(item => (
          <a key={item} href="#" className="nav-link">{item}</a>
        ))}
      </nav>

      <div className={`navbar-search ${searchFocused ? 'focused' : ''}`}>
        <Search size={13} className="search-icon" />
        <input
          placeholder="Search files, projects, teams…"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <div className="search-kbd">
          <Command size={10}/><span>K</span>
        </div>
      </div>

      <div className="navbar-actions">
        <div className="nav-sep"/>
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

          {profileOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <span className="dropdown-title">SWITCH PROFILE</span>
              </div>
              <div className="user-list">
                {MOCK_USERS.map(user => (
                  <button 
                    key={user.id} 
                    className={`user-item ${currentUser.id === user.id ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentUser(user);
                      setProfileOpen(false);
                      window.location.reload(); // Quick reset of all components to fetch new user data
                    }}
                  >
                    <div className="user-item-avatar">
                      {user.initials}
                    </div>
                    <div className="user-item-info">
                      <span className="user-item-name">{user.name}</span>
                      <span className="user-item-email">{user.email}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="dropdown-footer">
                <button className="dropdown-opt"><UserIcon size={12}/> View Profile</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
