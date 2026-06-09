import React, { useState, useEffect } from 'react';
import { useDevMode } from '../../hooks/useDevMode';
import { getDomainForBadge, DomainType } from '../../config/devBadgeRegistry';

interface DevBadgeProps {
  id?: string;
  domain?: DomainType;
  label?: string;
  className?: string;
}

const LOCAL_STORAGE_KEY = 'devBadgeOverrides';

export function DevBadge({ id, domain, label, className = '' }: DevBadgeProps) {
  const { isDevMode } = useDevMode();
  const [isEditing, setIsEditing] = useState(false);
  const [localDomain, setLocalDomain] = useState<DomainType | null>(null);

  useEffect(() => {
    if (id) {
      try {
        const overridesStr = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (overridesStr) {
          const overrides = JSON.parse(overridesStr);
          if (overrides[id]) {
            setLocalDomain(overrides[id] as DomainType);
          }
        }
      } catch (e) {
        console.error('Failed to parse devBadgeOverrides', e);
      }
    }
  }, [id]);

  if (!isDevMode) return null;

  const resolvedDomain: DomainType = localDomain || (id ? getDomainForBadge(id) : (domain || 'unmapped'));

  const handleSave = (newDomain: DomainType) => {
    if (id) {
      try {
        const overridesStr = localStorage.getItem(LOCAL_STORAGE_KEY);
        const overrides = overridesStr ? JSON.parse(overridesStr) : {};
        overrides[id] = newDomain;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(overrides));
        setLocalDomain(newDomain);
      } catch (e) {
        console.error('Failed to save dev badge override', e);
      }
    } else {
      setLocalDomain(newDomain);
    }
    setIsEditing(false);
  };

  const domainStyles = {
    api1: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50',
    api2: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50',
    mixed: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50',
    unmapped: 'text-gray-500 dark:text-gray-400 border border-dashed border-gray-400 dark:border-gray-600 bg-transparent',
  };

  const defaultLabels = {
    api1: 'API 1 (ERP)',
    api2: 'Interno',
    mixed: 'Misto / Orquestrado',
    unmapped: 'Não Mapeado',
  };

  const currentLabel = label || defaultLabels[resolvedDomain];

  if (isEditing) {
    return (
      <span className={`ml-2 inline-flex items-center gap-1 ${className}`}>
        <select
          autoFocus
          className="text-[10px] bg-white dark:bg-zinc-800 border border-gray-300 dark:border-gray-600 rounded px-1 py-0.5 outline-none font-sans text-zinc-900 dark:text-white"
          value={resolvedDomain}
          onChange={(e) => handleSave(e.target.value as DomainType)}
          onBlur={() => setIsEditing(false)}
        >
          <option value="api1">API 1 (ERP)</option>
          <option value="api2">Interno</option>
          <option value="mixed">Misto / Orquestrado</option>
          <option value="unmapped">Não Mapeado</option>
        </select>
      </span>
    );
  }

  return (
    <span 
      className={`ml-2 cursor-pointer select-none text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded transition-colors ${domainStyles[resolvedDomain]} ${className}`}
      title={`Fronteira de Domínio: ${currentLabel} (Duplo clique para editar)`}
      onDoubleClick={() => setIsEditing(true)}
    >
      {currentLabel}
    </span>
  );
}
