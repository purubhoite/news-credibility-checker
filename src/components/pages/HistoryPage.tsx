import React from 'react';
import { HistoryItem } from '../../types';
import { HistoryList } from '../organisms/HistoryList';

interface HistoryPageProps {
  items: HistoryItem[];
  onRerun: (item: HistoryItem) => void;
  onDelete: (itemId: string) => void;
  onItemClick: (item: HistoryItem) => void;
  className?: string;
}

export function HistoryPage({ 
  items, 
  onRerun, 
  onDelete, 
  onItemClick, 
  className = '' 
}: HistoryPageProps) {
  return (
    <main className={`flex-1 p-4 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-900 mb-2">
            Check History
          </h1>
          <p className="text-muted-500">
            Review your previous fact-checks and re-run analysis for updated results
          </p>
        </div>

        <HistoryList
          items={items}
          onRerun={onRerun}
          onDelete={onDelete}
          onItemClick={onItemClick}
        />
      </div>
    </main>
  );
}