'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal,
  Send,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
  MessageSquare,
  Shield,
  Zap,
  Globe,
  Radio
} from 'lucide-react';

interface CommandLog {
  id: string;
  command: string;
  timestamp: string;
  status: 'running' | 'success' | 'error';
  summary?: string;
  output?: string;
  results?: any;
}

const PRESET_COMMANDS = [
  '⚡ Send test SMS to 08022791227',
  '🎯 Scrape 15 salon leads in Ikeja',
  '🛡️ Check SMS gateway & system health',
  '📋 Show pending website claims',
  '⚙️ Set safe ramp limit to 45 msgs/day',
  '🌐 Show uncontacted clinic leads in Lekki'
];

interface AdminAiCommandTerminalProps {
  initialOpen?: boolean;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
  hideFloatingTrigger?: boolean;
}

export default function AdminAiCommandTerminal({
  initialOpen = false,
  isOpen: controlledOpen,
  onToggle,
  hideFloatingTrigger = false
}: AdminAiCommandTerminalProps) {
  const [internalOpen, setInternalOpen] = useState(initialOpen);
  const isCurrentlyOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const setOpenState = (newState: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof newState === 'function' ? newState(isCurrentlyOpen) : newState;
    if (onToggle) {
      onToggle(nextVal);
    } else {
      setInternalOpen(nextVal);
    }
  };

  const [isMinimized, setIsMinimized] = useState(false);
  const [inputCommand, setInputCommand] = useState('');
  const [executing, setExecuting] = useState(false);
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: 'welcome',
      command: 'system --init',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'success',
      summary: '⚡ AI Admin Copilot Ready',
      output: `### 🤖 Bethelmind AI Admin Command Prompt\nType any natural language command to execute tasks across your dashboard.\n\n**Examples:**\n- \`Send test SMS to 08022791227\`\n- \`Scrape 20 clinic leads in Lekki\`\n- \`Check SMS gateway health\`\n- \`Show pending claims\``
    }
  ]);

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCurrentlyOpen && !isMinimized) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isCurrentlyOpen, isMinimized]);

  // Global hotkey Ctrl+K / Cmd+K to toggle AI Command Prompt
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpenState(prev => !prev);
        if (!isCurrentlyOpen) {
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCurrentlyOpen]);

  const handleExecute = async (cmdToRun?: string) => {
    const commandText = (cmdToRun || inputCommand).trim();
    if (!commandText || executing) return;

    const logId = `cmd_${Date.now()}`;
    const newLog: CommandLog = {
      id: logId,
      command: commandText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'running'
    };

    setLogs(prev => [...prev, newLog]);
    setInputCommand('');
    setExecuting(true);

    try {
      const res = await fetch('/api/admin/command-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: commandText })
      });
      const data = await res.json();

      setLogs(prev =>
        prev.map(item =>
          item.id === logId
            ? {
                ...item,
                status: data.success ? 'success' : 'error',
                summary: data.summary || (data.success ? 'Command executed successfully' : 'Command failed'),
                output: data.output || data.error,
                results: data.results || data.data
              }
            : item
        )
      );
    } catch (err: any) {
      setLogs(prev =>
        prev.map(item =>
          item.id === logId
            ? {
                ...item,
                status: 'error',
                summary: 'Execution Error',
                output: `❌ Network connection error: ${err.message}`
              }
            : item
        )
      );
    } finally {
      setExecuting(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Render markdown-like simple text safely
  const renderFormattedOutput = (text: string) => {
    if (!text) return null;
    return (
      <div
        className="ai-copilot-output"
        style={{
          fontSize: '0.82rem',
          lineHeight: '1.6',
          color: '#e2e8f0',
          whiteSpace: 'pre-wrap',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        {text.split('\n').map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} style={{ color: '#10b981', margin: '8px 0 4px', fontSize: '0.95rem', fontWeight: 700 }}>
                {line.replace('### ', '')}
              </h4>
            );
          }
          if (line.startsWith('- **') || line.startsWith('- ')) {
            return (
              <div key={idx} style={{ paddingLeft: '8px', margin: '2px 0' }}>
                {line}
              </div>
            );
          }
          if (line.startsWith('|')) {
            return (
              <div key={idx} style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#94a3b8' }}>
                {line}
              </div>
            );
          }
          return <p key={idx} style={{ margin: '2px 0' }}>{line}</p>;
        })}
      </div>
    );
  };

  if (!isCurrentlyOpen) {
    if (hideFloatingTrigger) return null;
    return (
      <button
        onClick={() => {
          setOpenState(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#ffffff',
          border: '1px solid rgba(52, 211, 153, 0.4)',
          borderRadius: '50px',
          padding: '12px 20px',
          fontSize: '0.85rem',
          fontWeight: 700,
          boxShadow: '0 8px 30px rgba(16, 185, 129, 0.35), 0 0 15px rgba(16, 185, 129, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          transform: 'translateY(0)'
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0) scale(1)')}
      >
        <Sparkles style={{ width: 18, height: 18, color: '#fef08a' }} />
        <span>AI Admin Copilot</span>
        <span
          style={{
            background: 'rgba(0,0,0,0.25)',
            padding: '2px 6px',
            borderRadius: '6px',
            fontSize: '0.7rem',
            color: '#a7f3d0'
          }}
        >
          Ctrl+K
        </span>
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: isMinimized ? '340px' : '620px',
        height: isMinimized ? '52px' : '580px',
        maxHeight: '90vh',
        maxWidth: 'calc(100vw - 48px)',
        zIndex: 9999,
        background: '#041109',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(16, 185, 129, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: "'Inter', -apple-system, sans-serif",
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          background: 'linear-gradient(90deg, #062013 0%, #03140b 100%)',
          borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}
          >
            <Terminal style={{ width: 15, height: 15, color: '#10b981' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f0fdf4', letterSpacing: '-0.01em' }}>
                AI Admin Copilot Assistant
              </span>
              <span
                style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#4ade80',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '4px'
                }}
              >
                ACTIVE
              </span>
            </div>
            {!isMinimized && (
              <span style={{ fontSize: '0.68rem', color: '#6ee7b7' }}>
                Type in English or commands to automate any dashboard action
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setIsMinimized(prev => !prev)}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px'
            }}
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 style={{ width: 14, height: 14 }} /> : <Minimize2 style={{ width: 14, height: 14 }} />}
          </button>
          <button
            onClick={() => setOpenState(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px'
            }}
            title="Close"
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Quick Preset Command Chips */}
          <div
            style={{
              background: '#020905',
              padding: '8px 12px',
              borderBottom: '1px solid rgba(16, 185, 129, 0.12)',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              scrollbarWidth: 'none'
            }}
          >
            {PRESET_COMMANDS.map((preset, i) => (
              <button
                key={i}
                onClick={() => {
                  const cleaned = preset.replace(/^[^\w]+/, '').trim();
                  handleExecute(cleaned);
                }}
                disabled={executing}
                style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '20px',
                  color: '#a7f3d0',
                  fontSize: '0.72rem',
                  padding: '4px 10px',
                  cursor: executing ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                  flexShrink: 0
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(16, 185, 129, 0.08)')}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Terminal / Chat Output Log Area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              background: '#030d07',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            {logs.map((log) => (
              <div
                key={log.id}
                style={{
                  background: log.status === 'error' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(6, 32, 19, 0.7)',
                  border: `1px solid ${
                    log.status === 'error'
                      ? 'rgba(239, 68, 68, 0.3)'
                      : log.status === 'running'
                      ? 'rgba(245, 158, 11, 0.4)'
                      : 'rgba(16, 185, 129, 0.25)'
                  }`,
                  borderRadius: '10px',
                  padding: '12px 14px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
                }}
              >
                {/* Command Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '80%' }}>
                    <ChevronRight style={{ width: 14, height: 14, color: '#10b981', flexShrink: 0 }} />
                    <code style={{ fontSize: '0.82rem', color: '#f0fdf4', fontWeight: 600, wordBreak: 'break-all' }}>
                      {log.command}
                    </code>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#64748b' }}>
                    <Clock style={{ width: 11, height: 11 }} />
                    <span>{log.timestamp}</span>
                  </div>
                </div>

                {/* Status / Output */}
                {log.status === 'running' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontSize: '0.78rem' }}>
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        border: '2px solid #fbbf24',
                        borderTopColor: 'transparent',
                        animation: 'spin 0.8s linear infinite'
                      }}
                    />
                    <span>AI Copilot executing task across dashboard services...</span>
                  </div>
                )}

                {log.status !== 'running' && log.output && (
                  <div style={{ marginTop: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '8px' }}>
                    {renderFormattedOutput(log.output)}
                  </div>
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Command Input Prompt Bar */}
          <div
            style={{
              padding: '12px 14px',
              background: '#04140b',
              borderTop: '1px solid rgba(16, 185, 129, 0.2)'
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleExecute();
              }}
              style={{ display: 'flex', gap: '8px', position: 'relative' }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Terminal style={{ width: 15, height: 15 }} />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={inputCommand}
                onChange={(e) => setInputCommand(e.target.value)}
                placeholder="Type command or natural request (e.g. Send SMS test to 08022791227)..."
                disabled={executing}
                style={{
                  flex: 1,
                  background: '#020b06',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '10px',
                  padding: '11px 12px 11px 36px',
                  color: '#f0fdf4',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.4)'
                }}
              />
              <button
                type="submit"
                disabled={executing || !inputCommand.trim()}
                style={{
                  background: executing || !inputCommand.trim() ? 'rgba(16, 185, 129, 0.2)' : 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0 18px',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: executing || !inputCommand.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                }}
              >
                <Send style={{ width: 14, height: 14 }} />
                <span>Run</span>
              </button>
            </form>
          </div>
        </>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
