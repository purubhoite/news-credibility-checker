import React from 'react';
import { Trash2, RotateCcw, Calendar } from 'lucide-react';
import { HistoryItem } from '../../types';
import { VerdictBadge } from '../atoms/VerdictBadge';
import { IconButton } from '../atoms/IconButton';
import { Card } from '../ui/card';

interface HistoryListProps {
  items: HistoryItem[];
  onRerun: (item: HistoryItem) => void;
  onDelete: (itemId: string) => void;
  onItemClick: (item: HistoryItem) => void;
  className?: string;
}

export function HistoryList({ 
  items, 
  onRerun, 
  onDelete, 
  onItemClick, 
  className = '' 
}: HistoryListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (items.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Calendar className="w-12 h-12 text-muted-500 mx-auto mb-4" />
        <h3 className="font-medium text-text-900 mb-2">No checks yet</h3>
        <p className="text-muted-500">
          Paste a claim to start verifying.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <Card
          key={item.id}
          className="p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onItemClick(item)}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <VerdictBadge verdict={item.verdict} />
                <span className="text-sm text-muted-500">
                  {item.confidence}% confidence
                </span>
              </div>
              
              <h3 className="font-medium text-text-900 line-clamp-2 leading-snug mb-2">
                {item.cleanedClaim || item.originalClaim}
              </h3>
              
              <p className="text-sm text-muted-500 line-clamp-2">
                {item.summary}
              </p>
              
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-500">
                <Calendar className="w-3 h-3" />
                <time dateTime={item.checkedAt}>
                  {formatDate(item.checkedAt)}
                </time>
              </div>
            </div>
            
            <div className="flex items-center gap-1 flex-shrink-0">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onRerun(item);
                }}
                aria-label={`Re-run check for: ${item.cleanedClaim || item.originalClaim}`}
                variant="ghost"
                size="sm"
              >
                <RotateCcw className="w-4 h-4" />
              </IconButton>
              
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                aria-label={`Delete check: ${item.cleanedClaim || item.originalClaim}`}
                variant="ghost"
                size="sm"
                className="text-danger-red hover:text-danger-red hover:bg-danger-red/10"
              >
                <Trash2 className="w-4 h-4" />
              </IconButton>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}