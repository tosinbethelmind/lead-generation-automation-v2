// src/app/dashboard/components/ScrapeControls.tsx
import React from 'react';
import { Search, Loader2 } from 'lucide-react';

interface ScrapeControlsProps {
  selectedScraper: string;
  query: string;
  setQuery: (val: string) => void;
  limit: number;
  setLimit: (val: number) => void;
  scraping: boolean;
  onExecute: () => void;
  isConfigured: boolean;
  requiresKey: boolean;
  runAllConcurrently: boolean;
  setRunAllConcurrently: (val: boolean) => void;
}

export default function ScrapeControls({
  selectedScraper,
  query,
  setQuery,
  limit,
  setLimit,
  scraping,
  onExecute,
  isConfigured,
  requiresKey,
  runAllConcurrently,
  setRunAllConcurrently
}: ScrapeControlsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            {selectedScraper === 'jiji' ? 'Jiji Category, Keyword or URL' : 'Industry / Keyword Search Query'}
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              selectedScraper === 'jiji'
                ? 'e.g. cars or https://jiji.ng/cars'
                : selectedScraper === 'osm'
                ? 'e.g. Dentists Ikeja'
                : 'e.g. Dentists Ikeja'
            }
            style={{
              width: '100%',
              padding: '10px',
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid var(--panel-border)',
              borderRadius: '8px',
              color: '#fff',
              outline: 'none',
              fontSize: '0.9rem'
            }}
          />
        </div>
        
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Max Results</label>
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '10px',
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid var(--panel-border)',
              borderRadius: '8px',
              color: '#fff',
              outline: 'none',
              fontSize: '0.9rem'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
        <input
          type="checkbox"
          id="run-all-concurrently-check"
          checked={runAllConcurrently}
          onChange={(e) => setRunAllConcurrently(e.target.checked)}
          style={{
            width: '16px',
            height: '16px',
            accentColor: 'var(--primary)',
            cursor: 'pointer'
          }}
        />
        <label 
          htmlFor="run-all-concurrently-check" 
          style={{ fontSize: '0.82rem', color: '#e2e8f0', cursor: 'pointer', userSelect: 'none' }}
        >
          Run query on all scraping engines concurrently (Maps, OSM, Jiji, Socials, DuckDuckGo)
        </label>
      </div>

      <button
        onClick={onExecute}
        disabled={scraping}
        className="btn-primary"
        style={{
          marginTop: '4px',
          alignSelf: 'flex-start',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        {scraping ? (
          <>
            <Loader2 size={16} className="spin-anim" />
            Starting Scraper...
          </>
        ) : (
          <>
            <Search size={16} />
            Start Scraper
          </>
        )}
      </button>

      {/* Warnings & Messages */}
      {!runAllConcurrently && requiresKey && !isConfigured && (
        <div style={{ fontSize: '0.8rem', color: 'var(--warning)', marginTop: '4px' }}>
          ⚠️ Provider API key is missing. Scraper will fall back to sandbox mode with simulated B2B leads.
        </div>
      )}
      {!runAllConcurrently && !requiresKey && (
        <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '4px' }}>
          ✨ This provider does not require any external API keys.
        </div>
      )}
      {runAllConcurrently && (
        <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '4px' }}>
          💡 All 7 engines will be queued in parallel. Standard API key limits / browser restrictions will be bypassed using proxy and queue routing.
        </div>
      )}
    </div>
  );
}
