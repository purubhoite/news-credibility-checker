import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ClaimAnalysis } from '../../types';
import { ResultsPanel } from '../organisms/ResultsPanel';
import { Button } from '../ui/button';

interface ResultsPageProps {
  analysis: ClaimAnalysis;
  onBack: () => void;
  className?: string;
}

export function ResultsPage({ analysis, onBack, className = '' }: ResultsPageProps) {
  return (
    <main className={`flex-1 p-4 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to search
          </Button>
          
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-text-900">
              Fact Check Results
            </h1>
            <small className="text-muted-500">
              Checked on {new Date(analysis.checkedAt).toLocaleDateString()}
            </small>
          </div>
        </div>

        <ResultsPanel analysis={analysis} />
      </div>
    </main>
  );
}