import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, continueAsGuest } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter a User ID or Email");
      return;
    }
    setIsSubmitting(true);
    // Mock login delay
    setTimeout(() => {
      // For demo: if email is '1', '2', '3', or '4', use that ID, otherwise use '4' (You)
      const mockId = ['1', '2', '3', '4'].includes(email) ? email : '4';
      login(mockId);
      toast.success(`Welcome back!`);
      setIsSubmitting(false);
      window.location.href = '/';
    }, 800);
  };

  const handleGuest = () => {
    continueAsGuest();
    window.location.href = '/';
  };

  return (
    <div className="login-page">
      {/* Dynamic Hexagon Background */}
      <div className="welcome-bg">
        <div className="orb orb1" />
        <div className="orb orb2" />
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <svg viewBox="0 0 40 46" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="54">
              <path d="M20 1L38 11.5V34.5L20 45L2 34.5V11.5L20 1Z"
                fill="url(#hexGradLogin)" stroke="#2dd4bf" strokeWidth="2"/>
              <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
                fill="white" fontSize="18" fontWeight="800" fontFamily="JetBrains Mono">H</text>
              <defs>
                <linearGradient id="hexGradLogin" x1="2" y1="1" x2="38" y2="45" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0f2027"/>
                  <stop offset="1" stopColor="#1a1f2e"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="login-title">HIVEHUB</h1>
          <p style={{ color: 'var(--text2)', fontSize: '13px' }}>The future of collaborative coding</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-input-group">
            <label><User size={10} style={{ marginRight: 4 }}/> User ID or Email</label>
            <input 
              placeholder="e.g. 1, 2, 3 or code@hivehub.dev" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="login-input-group">
            <label><Lock size={10} style={{ marginRight: 4 }}/> Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <button type="submit" className="login-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border2)' }} />
          <span style={{ fontSize: 10, color: 'var(--text2)', textTransform: 'uppercase' }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border2)' }} />
        </div>

        <button className="guest-btn" onClick={handleGuest} disabled={isSubmitting}>
          Continue as Guest
        </button>

        <div className="login-footer">
          Don't have an account? <span>Join the waitlist</span>
        </div>
      </div>
    </div>
  );
}
