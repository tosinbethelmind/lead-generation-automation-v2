"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupPage() {
  const router = useRouter();
  const [geminiKeys, setGeminiKeys] = useState(''); // comma separated
  const [antigravityKeys, setAntigravityKeys] = useState(''); // comma separated, up to 10 keys
  const [antigravityModels, setAntigravityModels] = useState('gemini_flash_high,gemini_pro_low,gpt_oss,claude,sonneta,opus');
  const [onGroundMode, setOnGroundMode] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Saving...');
    const updates: any = {
      antigravityApiKeys: antigravityKeys.split(',').map(k => k.trim()).filter(Boolean),
      antigravityModels: antigravityModels.split(',').map(m => m.trim()).filter(Boolean),
      onGroundMode,
    };
    if (geminiKeys.trim()) {
      updates.geminiApiKeys = geminiKeys.split(',').map(k => k.trim()).filter(Boolean);
    }
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('Configuration saved!');
        // optional: refresh page or navigate
        router.refresh();
      } else {
        setStatus(`Error: ${data.error || 'unknown'}`);
      }
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">App Configuration</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <label className="flex flex-col">
          <span className="font-medium mb-1">Gemini API Keys (comma separated)</span>
          <input
            type="text"
            value={geminiKeys}
            onChange={e => setGeminiKeys(e.target.value)}
            placeholder="e.g., key1,key2"
            className="border rounded px-3 py-2"
          />
        </label>
        <label className="flex flex-col">
          <span className="font-medium mb-1">Antigravity API Keys (comma separated, up to 10)</span>
            <input
              type="text"
              value={antigravityKeys}
              onChange={e => setAntigravityKeys(e.target.value)}
              placeholder="key1,key2,... up to 10"
              className="border rounded px-3 py-2"
            />
        </label>
        <label className="flex flex-col">
          <span className="font-medium mb-1">Antigravity Models (comma separated)</span>
          <input
            type="text"
            value={antigravityModels}
            onChange={e => setAntigravityModels(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={onGroundMode}
            onChange={e => setOnGroundMode(e.target.checked)}
            className="h-4 w-4"
          />
          <span className="font-medium">Enable On‑Ground Mode (use fallback copy only)</span>
        </label>
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Save Configuration
        </button>
        {status && <p className="mt-2 text-sm">{status}</p>}
      </form>
    </main>
  );
}
