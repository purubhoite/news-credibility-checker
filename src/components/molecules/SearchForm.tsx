import React, { useState } from 'react';
import { Search, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';

interface SearchFormProps {
  onSubmit: (claim: string) => void;
  isLoading?: boolean;
  className?: string;
}

const sampleClaims = [
  'Modi banned 2000 note again true??',
  'COVID vaccine causes autism',
  'Earth is flat proof found by NASA',
];

const languageOptions = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'es', label: 'Spanish' },
];

export function SearchForm({ onSubmit, isLoading = false, className = '' }: SearchFormProps) {
  const [claim, setClaim] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (claim.trim()) {
      onSubmit(claim.trim());
    }
  };

  const handleSampleClick = (sampleClaim: string) => {
    setClaim(sampleClaim);
    onSubmit(sampleClaim);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="claim-input" className="sr-only">
            Enter the claim to check
          </label>
          <Textarea
            id="claim-input"
            placeholder="Paste the message or URL you received…"
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[100px] resize-none"
            disabled={isLoading}
            aria-describedby="claim-help"
          />
          <p id="claim-help" className="text-sm text-muted-500">
            Press Enter to check, or Shift+Enter for new line
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="language-select" className="text-sm font-medium text-text-900">
              Language:
            </label>
            <select
              id="language-select"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-2 py-1 text-sm border border-border rounded-md bg-surface focus:ring-2 focus:ring-primary-800 focus:border-transparent"
              disabled={isLoading}
            >
              {languageOptions.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <Button
            type="submit"
            disabled={!claim.trim() || isLoading}
            className="px-6"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-surface border-t-transparent mr-2" />
                Checking...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Check
              </>
            )}
          </Button>
        </div>
      </form>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-text-900 mb-3">Try these examples:</h3>
        <div className="flex flex-wrap gap-2">
          {sampleClaims.map((sampleClaim, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="cursor-pointer hover:bg-muted transition-colors"
              onClick={() => handleSampleClick(sampleClaim)}
            >
              <Zap className="w-3 h-3 mr-1" />
              Try sample
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}