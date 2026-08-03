import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import { api } from '../../utils/api';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    // Helper untuk membuat admin default pertama kali
    api.post('/auth/init').catch(e => console.error("Init failed:", e));
  }, []);

  const handleLogin = async (e) => {
    e.submitter && e.preventDefault(); // allow form submit
    
    if (!username || !password) {
      setError('Username dan Password harus diisi');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const data = await api.post('/auth/login', { username, password });
      localStorage.setItem('bismart_token', data.token);
      localStorage.setItem('bismart_admin', JSON.stringify(data.user));
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Username atau Password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glass-panel">
        <div className="login-header">
          <h2>Admin Login</h2>
          <p>Sistem Informasi BISmart</p>
        </div>
        
        {error && <div className="login-error">{error}</div>}
        
        <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleLogin(e); }}>
          <div className="form-group">
            <label>Username</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input 
                type="text" 
                placeholder="Masukkan username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                placeholder="Masukkan password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Memeriksa...' : 'Login ke Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
