import React, { useState } from 'react';
import { Copy, Share, Save, Flag, ChevronDown, ChevronUp } from 'lucide-react';
import { ClaimAnalysis } from '../../types';
import { ClaimCard } from '../molecules/ClaimCard';
import { VerdictMeter } from '../molecules/VerdictMeter';
import { VerdictBadge } from '../atoms/VerdictBadge';
import { SourceItem } from '../molecules/SourceItem';
import { IconButton } from '../atoms/IconButton';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

interface ResultsPanelProps {
  analysis: ClaimAnalysis;
  className?: string;
}

export function ResultsPanel({ analysis, className = '' }: ResultsPanelProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  const handleCopy = () => {
    const text = `Claim: ${analysis.cleanedClaim}\nVerdict: ${analysis.verdict.toUpperCase()}\nConfidence: ${analysis.confidence}%\nSummary: ${analysis.summary}`;
    navigator.clipboard.writeText(text);
    // TODO: Show toast notification
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'NewsCheck Analysis',
        text: `Claim analysis: ${analysis.verdict.toUpperCase()} with ${analysis.confidence}% confidence`,
        url: window.location.href,
      });
    } else {
      handleCopy();
    }
  };

  const handleSave = () => {
    // TODO: Implement save to history
    console.log('Saving to history:', analysis);
  };

  const handleReport = () => {
    // TODO: Implement report functionality
    console.log('Reporting issue with:', analysis);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Claim Card */}
      <ClaimCard
        originalClaim={analysis.originalClaim}
        cleanedClaim={analysis.cleanedClaim}
      />

      {/* Verdict Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <VerdictMeter
              verdict={analysis.verdict}
              confidence={analysis.confidence}
              size="lg"
            />
            <div>
              <VerdictBadge verdict={analysis.verdict} className="mb-2" />
              <p className="text-sm text-muted-500">
                {analysis.confidence}% confidence
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <IconButton
              onClick={handleCopy}
              aria-label="Copy results"
              variant="ghost"
            >
              <Copy className="w-4 h-4" />
            </IconButton>
            
            <IconButton
              onClick={handleShare}
              aria-label="Share results"
              variant="ghost"
            >
              <Share className="w-4 h-4" />
            </IconButton>
            
            <IconButton
              onClick={handleSave}
              aria-label="Save to history"
              variant="ghost"
            >
              <Save className="w-4 h-4" />
            </IconButton>
            
            <IconButton
              onClick={handleReport}
              aria-label="Report issue"
              variant="ghost"
            >
              <Flag className="w-4 h-4" />
            </IconButton>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-text-900 mb-2">Summary</h3>
            <p className="text-text-900 leading-relaxed">{analysis.summary}</p>
          </div>

          {/* How decision was reached */}
          <Collapsible open={showExplanation} onOpenChange={setShowExplanation}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="p-0 h-auto font-normal justify-start">
                {showExplanation ? (
                  <ChevronUp className="w-4 h-4 mr-2" />
                ) : (
                  <ChevronDown className="w-4 h-4 mr-2" />
                )}
                How this decision was reached
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="bg-bg-100 p-4 rounded-lg text-sm text-text-900 leading-relaxed">
                <p>
                  Our analysis examined {analysis.sources.length} sources and cross-referenced the claim 
                  against reliable news outlets and fact-checking organizations. The verdict was determined 
                  based on source reliability scores, publication recency, and consensus among multiple sources.
                </p>
                <p className="mt-2">
                  Confidence score reflects the agreement level between sources and the overall quality 
                  of evidence found.
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </Card>

      {/* Sources Section */}
      <div>
        <h2 className="font-medium text-text-900 mb-4">
          Sources ({analysis.sources.length})
        </h2>
        <div className="space-y-3">
          {analysis.sources.map((source, index) => (
            <SourceItem key={index} source={source} />
          ))}
        </div>
      </div>
    </div>
  );
}