'use client';

import React, { useState, useEffect } from 'react';
import { KeyRound, ShieldAlert, Loader2, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [redirectPath, setRedirectPath] = useState('/admin');

  useEffect(() => {
    // Safely parse redirect query param on client side
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect');
      if (redirect) {
        setRedirectPath(redirect);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setError('Token is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Redirect to dashboard
        window.location.href = redirectPath;
      } else {
        setError(data.message || 'Authentication failed. Please verify your token.');
      }
    } catch (err: any) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glass-panel">
        <div className="login-header">
          <div className="icon-glow">
            <KeyRound className="key-icon" />
          </div>
          <h1>Admin Portal</h1>
          <p>Please enter your secure administrator token to gain entry to the dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="token">Security Token</label>
            <div className="input-wrapper">
              <input
                id="token"
                type="password"
                placeholder="••••••••••••••••••••••••"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="error-message">
              <ShieldAlert className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="btn-primary login-btn" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="spin-anim" /> Authenticating...
              </>
            ) : (
              <>
                Enter Dashboard <ArrowRight />
              </>
            )}
          </button>
        </form>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #07090e;
          padding: 20px;
          position: relative;
          overflow: hidden;
          font-family: var(--font-sans, 'Inter', sans-serif);
        }

        /* Ambient background glow */
        .login-container::before {
          content: "";
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(0,0,0,0) 70%);
          top: 10%;
          left: 10%;
          z-index: 1;
        }

        .login-container::after {
          content: "";
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, rgba(0,0,0,0) 70%);
          bottom: 10%;
          right: 10%;
          z-index: 1;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          padding: 40px;
          position: relative;
          z-index: 10;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          border-radius: 20px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .icon-glow {
          width: 60px;
          height: 60px;
          border-radius: 15px;
          background: rgba(6, 182, 212, 0.1);
          border: 1px solid rgba(6, 182, 212, 0.3);
          color: var(--primary, #06b6d4);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.15);
        }

        .key-icon {
          width: 28px;
          height: 28px;
        }

        .login-header h1 {
          font-family: var(--font-title, 'Outfit', sans-serif);
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #f8fafc 30%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .login-header p {
          color: var(--text-secondary, #94a3b8);
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          color: var(--text-primary, #f8fafc);
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .input-wrapper input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(0, 0, 0, 0.3) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 10px;
          color: #fff !important;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
        }

        .input-wrapper input:focus {
          border-color: var(--primary, #06b6d4) !important;
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.15);
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          color: #f87171;
          font-size: 0.85rem;
        }

        .error-icon {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        .login-btn {
          width: 100%;
          justify-content: center;
          padding: 12px;
          font-size: 0.95rem;
          background: linear-gradient(135deg, var(--primary, #06b6d4) 0%, #0891b2 100%);
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.25);
        }

        .login-btn:hover {
          box-shadow: 0 0 25px rgba(6, 182, 212, 0.45);
        }
      `}</style>
    </div>
  );
}
