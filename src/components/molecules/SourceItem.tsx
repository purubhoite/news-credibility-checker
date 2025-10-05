import React from 'react';
import { ExternalLink, Calendar } from 'lucide-react';
import { Source } from '../../types';

interface SourceItemProps {
  source: Source;
  className?: string;
}

export function SourceItem({ source, className = '' }: SourceItemProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getReliabilityColor = (score: number) => {
    if (score >= 90) return 'text-accent-green';
    if (score >= 70) return 'text-warn-orange';
    return 'text-danger-red';
  };

  return (
    <article className={`bg-surface border border-border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-text-900 line-clamp-2 leading-snug">
            <a 
              href={source.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-link-blue hover:underline"
            >
              {source.title}
              <ExternalLink className="inline w-3 h-3 ml-1" aria-hidden="true" />
            </a>
          </h4>
          
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-500">
            <span>{source.source}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" aria-hidden="true" />
              <time dateTime={source.publishedAt}>
                {formatDate(source.publishedAt)}
              </time>
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <span className={`text-sm font-medium ${getReliabilityColor(source.reliabilityScore)}`}>
            {source.reliabilityScore}%
          </span>
        </div>
      </div>
      
      <p className="text-text-900 text-sm leading-relaxed">
        {source.snippet}
      </p>
    </article>
  );
}