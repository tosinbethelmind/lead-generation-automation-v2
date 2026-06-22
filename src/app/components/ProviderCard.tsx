import React, { useState } from 'react';

interface ProviderCardProps {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
  children?: React.ReactNode; // Inline configuration form
  expanded?: boolean;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  id,
  name,
  description,
  icon,
  selected,
  onSelect,
  children,
  expanded: forceExpanded,
}) => {
  const [expanded, setExpanded] = useState(selected);
  // If external expanded prop is provided, it overrides internal state
  const isExpanded = typeof forceExpanded === 'boolean' ? forceExpanded : expanded;

  const handleConfigure = () => {
    onSelect();
    setExpanded(!expanded);
  };

  return (
    <div
      style={{
        border: selected ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '16px',
        background: 'rgba(0,0,0,0.1)',
        transition: 'all 0.2s',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} onClick={handleConfigure}>
        {icon && <span>{icon}</span>}
        <div>
          <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary)' }}>{name}</h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{description}</p>
        </div>
      </div>
      {isExpanded && children && (
        <div style={{ marginTop: '12px' }}>
          {children}
        </div>
      )}
    </div>
  );
};
