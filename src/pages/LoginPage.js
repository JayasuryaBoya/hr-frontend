import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';

const LoginPage = () => {
  const navigate  = useNavigate();
  const [username, setUser]  = useState('');
  const [password, setPass]  = useState('');
  const [showPass, setShow]  = useState(false);
  const [error,    setError] = useState('');
  const [loading,  setLoad]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoad(true);
    try {
      await login(username, password);
      sessionStorage.setItem('isLoggedIn', 'true');
      navigate('/import');
    } catch (err) {
      setError(err.response?.data?.error || '❌ Login failed.');
    } finally {
      setLoad(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card card">

        {/* ── Header ── */}
        <div className="login-header">
          <i className="bi bi-lock-fill fs-3"></i>
          <h4>Login</h4>
        </div>

        {/* ── Body ── */}
        <div className="login-body">

          {error && (
            <div className="alert alert-danger d-flex align-items-center
                            gap-2 rounded-3 py-2 mb-3" style={{ fontSize: 13 }}>
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">
                <i className="bi bi-person me-1"></i>Username
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter username"
                autoFocus required
                value={username}
                onChange={e => setUser(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="form-label">
                <i className="bi bi-lock me-1"></i>Password
              </label>
              <div className="position-relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter password"
                  required
                  value={password}
                  onChange={e => setPass(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShow(s => !s)}
                  className="btn btn-sm position-absolute top-50 end-0
                             translate-middle-y me-2 border-0
                             bg-transparent text-muted p-0">
                  <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2"></span>Logging in...</>
                : <><i className="bi bi-box-arrow-in-right me-2"></i>Sign in</>}
            </button>
          </form>

          <div className="text-center mt-3">
            <a href="#!" style={{ color: '#94a3b8', fontSize: 13 }}>Forgot password?</a>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="login-footer">
          <i className="bi bi-shield-lock me-1"></i>
          Secured with JWT &nbsp;·&nbsp; Session 8 hours
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
