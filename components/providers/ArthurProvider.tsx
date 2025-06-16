'use client';

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useArthurTask } from '@/hooks/useArthurTask';

interface ArthurContextType {
  isLoading: boolean;
  isError: boolean;
  keywords: string[];
  regexPatterns: string[];
  piiConfig: {
    disabledEntities: string[];
    allowList: string[];
  } | null;
  toxicityThreshold: number | null;
  refresh: () => Promise<any>;
}

const ArthurContext = createContext<ArthurContextType | null>(null);

interface ArthurProviderProps {
  children: ReactNode;
}

export function ArthurProvider({ children }: ArthurProviderProps) {
  const { task, isLoading, isError, refresh } = useArthurTask();

  const value = {
    isLoading,
    isError,
    keywords:
      task?.rules
        .filter((rule) => rule.type === 'KeywordRule' && rule.enabled !== false)
        .flatMap((rule) => rule.config?.keywords || []) || [],
    regexPatterns:
      task?.rules
        .filter((rule) => rule.type === 'RegexRule' && rule.enabled !== false)
        .flatMap((rule) => rule.config?.regex_patterns || []) || [],
    piiConfig:
      task?.rules
        .filter((rule) => rule.type === 'PIIDataRule' && rule.enabled !== false)
        .map((rule) => ({
          disabledEntities: rule.config?.disabled_pii_entities || [],
          allowList: rule.config?.allow_list || [],
        }))[0] || null,
    toxicityThreshold:
      task?.rules.find(
        (rule) => rule.type === 'ToxicityRule' && rule.enabled !== false,
      )?.config?.threshold || null,
    refresh,
  };

  return (
    <ArthurContext.Provider value={value}>{children}</ArthurContext.Provider>
  );
}

export function useArthur() {
  const context = useContext(ArthurContext);
  if (!context) {
    throw new Error('useArthur must be used within an ArthurProvider');
  }
  return context;
}
