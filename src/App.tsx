import React, { useState, useEffect } from 'react';
import { AppState, PageView, ClaimAnalysis, HistoryItem, Settings } from './types';
import { NewsCheckAPI } from './services/api';
import { Header } from './components/organisms/Header';
import { SearchPage } from './components/pages/SearchPage';
import { ResultsPage } from './components/pages/ResultsPage';
import { HistoryPage } from './components/pages/HistoryPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

const defaultSettings: Settings = {
  enabledSources: ['reuters', 'bbc', 'ap', 'snopes', 'factcheck'],
  spellCorrectEnabled: true,
  confidenceThreshold: 70,
  language: 'en',
};

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    currentPage: 'search',
    currentAnalysis: null,
    history: [],
    settings: defaultSettings,
    isLoading: false,
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('newscheck-history');
    const savedSettings = localStorage.getItem('newscheck-settings');
    
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        setAppState(prev => ({ ...prev, history }));
      } catch (e) {
        console.error('Failed to load history:', e);
      }
    }
    
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setAppState(prev => ({ ...prev, settings: { ...defaultSettings, ...settings } }));
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }, []);

  // Save to localStorage whenever history or settings change
  useEffect(() => {
    localStorage.setItem('newscheck-history', JSON.stringify(appState.history));
  }, [appState.history]);

  useEffect(() => {
    localStorage.setItem('newscheck-settings', JSON.stringify(appState.settings));
  }, [appState.settings]);

  const handleSearch = async (claim: string) => {
    setAppState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const analysis = await NewsCheckAPI.analyzeClaim(claim);
      
      // Add to history
      const historyItem: HistoryItem = {
        ...analysis,
        timestamp: new Date().toISOString(),
      };
      
      setAppState(prev => ({
        ...prev,
        currentAnalysis: analysis,
        currentPage: 'results',
        isLoading: false,
        history: [historyItem, ...prev.history].slice(0, 50), // Keep only last 50 items
      }));
      
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Failed to analyze claim:', error);
      toast.error('Failed to analyze claim. Please try again.');
      setAppState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleNavigate = (page: PageView) => {
    setAppState(prev => ({ ...prev, currentPage: page }));
  };

  const handleBackToSearch = () => {
    setAppState(prev => ({ 
      ...prev, 
      currentPage: 'search',
      currentAnalysis: null 
    }));
  };

  const handleRerunAnalysis = async (item: HistoryItem) => {
    await handleSearch(item.originalClaim);
  };

  const handleDeleteHistoryItem = (itemId: string) => {
    setAppState(prev => ({
      ...prev,
      history: prev.history.filter(item => item.id !== itemId)
    }));
    toast.success('Item deleted from history');
  };

  const handleHistoryItemClick = (item: HistoryItem) => {
    setAppState(prev => ({
      ...prev,
      currentAnalysis: item,
      currentPage: 'results'
    }));
  };

  const handleUpdateSettings = (updates: Partial<Settings>) => {
    setAppState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates }
    }));
    toast.success('Settings updated');
  };

  const renderCurrentPage = () => {
    switch (appState.currentPage) {
      case 'search':
        return (
          <SearchPage
            onSearch={handleSearch}
            isLoading={appState.isLoading}
          />
        );
      
      case 'results':
        return appState.currentAnalysis ? (
          <ResultsPage
            analysis={appState.currentAnalysis}
            onBack={handleBackToSearch}
          />
        ) : (
          <SearchPage
            onSearch={handleSearch}
            isLoading={appState.isLoading}
          />
        );
      
      case 'history':
        return (
          <HistoryPage
            items={appState.history}
            onRerun={handleRerunAnalysis}
            onDelete={handleDeleteHistoryItem}
            onItemClick={handleHistoryItemClick}
          />
        );
      
      case 'settings':
        return (
          <SettingsPage
            settings={appState.settings}
            onUpdateSettings={handleUpdateSettings}
          />
        );
      
      default:
        return (
          <SearchPage
            onSearch={handleSearch}
            isLoading={appState.isLoading}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-bg-100 flex flex-col">
      <Header
        currentPage={appState.currentPage}
        onNavigate={handleNavigate}
      />
      
      {renderCurrentPage()}
      
      <footer className="bg-surface border-t border-border py-4 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-500">
          <p>
            NewsCheck helps you verify information against trusted sources. 
            Always consider multiple sources for important decisions.
          </p>
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
}