import React from 'react';
import { SearchForm } from '../molecules/SearchForm';
import { Spinner } from '../atoms/Spinner';

interface SearchPageProps {
  onSearch: (claim: string) => void;
  isLoading: boolean;
  className?: string;
}

export function SearchPage({ onSearch, isLoading, className = '' }: SearchPageProps) {
  return (
    <main className={`flex-1 flex items-center justify-center p-4 ${className}`}>
      <div className="w-full max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-text-900">
            Check news fast. Know what's true.
          </h1>
          <p className="text-xl text-muted-500 max-w-2xl mx-auto">
            Paste any claim, message, or URL you've received and we'll verify it 
            against trusted sources in seconds.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="bg-surface border border-border rounded-lg p-8">
              <Spinner size="lg" className="mx-auto mb-4" />
              <p className="text-text-900 font-medium mb-2">
                Analyzing claim — checking across reliable sources…
              </p>
              <p className="text-sm text-muted-500">
                This may take a few seconds while we verify the information
              </p>
            </div>
          </div>
        ) : (
          <SearchForm onSubmit={onSearch} isLoading={isLoading} />
        )}

        <div className="bg-bg-100 rounded-lg p-6 text-left max-w-2xl mx-auto">
          <h2 className="font-medium text-text-900 mb-3">How it works</h2>
          <div className="space-y-2 text-sm text-muted-500">
            <p>1. Paste the claim you want to verify</p>
            <p>2. We search across trusted news sources and fact-checkers</p>
            <p>3. Get an instant verdict with confidence score and sources</p>
          </div>
        </div>
      </div>
    </main>
  );
}