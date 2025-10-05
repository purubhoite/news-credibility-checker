import React from 'react';

interface ClaimCardProps {
  originalClaim: string;
  cleanedClaim?: string;
  className?: string;
}

export function ClaimCard({ originalClaim, cleanedClaim, className = '' }: ClaimCardProps) {
  return (
    <div className={`bg-surface border border-border rounded-lg p-4 space-y-3 ${className}`}>
      <div>
        <h3 className="font-medium text-text-900 mb-2">Original Claim</h3>
        <p className="text-text-900 leading-relaxed bg-bg-100 p-3 rounded-md">
          {originalClaim}
        </p>
      </div>
      
      {cleanedClaim && cleanedClaim !== originalClaim && (
        <div>
          <h3 className="font-medium text-text-900 mb-2">Cleaned Claim</h3>
          <p className="text-text-900 leading-relaxed">
            {cleanedClaim}
          </p>
        </div>
      )}
    </div>
  );
}