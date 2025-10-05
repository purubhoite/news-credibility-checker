import React from 'react';
import { Settings } from '../../types';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';

interface SettingsPageProps {
  settings: Settings;
  onUpdateSettings: (settings: Partial<Settings>) => void;
  className?: string;
}

const availableSources = [
  { id: 'reuters', name: 'Reuters' },
  { id: 'bbc', name: 'BBC News' },
  { id: 'ap', name: 'Associated Press' },
  { id: 'snopes', name: 'Snopes' },
  { id: 'factcheck', name: 'FactCheck.org' },
  { id: 'politifact', name: 'PolitiFact' },
];

const languageOptions = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
];

export function SettingsPage({ settings, onUpdateSettings, className = '' }: SettingsPageProps) {
  const handleSourceToggle = (sourceId: string, enabled: boolean) => {
    const updatedSources = enabled
      ? [...settings.enabledSources, sourceId]
      : settings.enabledSources.filter(id => id !== sourceId);
    
    onUpdateSettings({ enabledSources: updatedSources });
  };

  return (
    <main className={`flex-1 p-4 ${className}`}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-900 mb-2">
            Settings
          </h1>
          <p className="text-muted-500">
            Customize your fact-checking preferences and sources
          </p>
        </div>

        {/* Source Settings */}
        <Card className="p-6">
          <h2 className="font-medium text-text-900 mb-4">Trusted Sources</h2>
          <p className="text-sm text-muted-500 mb-4">
            Select which sources to include in fact-checking analysis
          </p>
          
          <div className="space-y-3">
            {availableSources.map((source) => (
              <div key={source.id} className="flex items-center justify-between">
                <Label htmlFor={`source-${source.id}`} className="text-text-900">
                  {source.name}
                </Label>
                <Switch
                  id={`source-${source.id}`}
                  checked={settings.enabledSources.includes(source.id)}
                  onCheckedChange={(checked) => handleSourceToggle(source.id, checked)}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Analysis Settings */}
        <Card className="p-6">
          <h2 className="font-medium text-text-900 mb-4">Analysis Options</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="spell-correct" className="text-text-900">
                  Enable spell correction
                </Label>
                <p className="text-sm text-muted-500">
                  Automatically fix spelling errors in claims
                </p>
              </div>
              <Switch
                id="spell-correct"
                checked={settings.spellCorrectEnabled}
                onCheckedChange={(checked) => onUpdateSettings({ spellCorrectEnabled: checked })}
              />
            </div>

            <div>
              <Label className="text-text-900 mb-3 block">
                Confidence Threshold: {settings.confidenceThreshold}%
              </Label>
              <p className="text-sm text-muted-500 mb-3">
                Minimum confidence level required for definitive verdicts
              </p>
              <Slider
                value={[settings.confidenceThreshold]}
                onValueChange={([value]) => onUpdateSettings({ confidenceThreshold: value })}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="language-select" className="text-text-900 mb-2 block">
                Default Language
              </Label>
              <Select
                value={settings.language}
                onValueChange={(value) => onUpdateSettings({ language: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* About */}
        <Card className="p-6">
          <h2 className="font-medium text-text-900 mb-4">About NewsCheck</h2>
          <div className="space-y-3 text-sm text-muted-500">
            <p>
              NewsCheck helps you verify claims and news stories by cross-referencing 
              them against trusted sources and fact-checking organizations.
            </p>
            <p>
              Our analysis considers source reliability, publication dates, and consensus 
              among multiple sources to provide you with accurate verdicts.
            </p>
            <p>
              <strong className="text-text-900">Privacy:</strong> Your searches are not stored 
              permanently and are only used to provide fact-checking results.
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}