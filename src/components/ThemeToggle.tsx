'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../app/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div 
        style={{ 
          width: '38px', 
          height: '38px', 
          borderRadius: '8px', 
          background: 'rgba(255,255,255,0.03)', 
          border: '1px solid rgba(255,255,255,0.05)' 
        }} 
      />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className="theme-toggle-btn"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '38px',
        height: '38px',
        borderRadius: '8px',
        background: 'var(--toggle-bg)',
        border: '1px solid var(--toggle-border)',
        color: 'var(--toggle-color)',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: 0,
        outline: 'none',
        boxShadow: 'var(--toggle-shadow)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: theme === 'dark' ? 'rotate(0deg)' : 'rotate(360deg)',
        }}
      >
        {theme === 'dark' ? (
          <Moon size={16} />
        ) : (
          <Sun size={16} />
        )}
      </div>
    </button>
  );
}
