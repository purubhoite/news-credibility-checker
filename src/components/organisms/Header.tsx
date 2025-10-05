import React from 'react';
import { Shield, History, Settings, Menu } from 'lucide-react';
import { IconButton } from '../atoms/IconButton';
import { PageView } from '../../types';

interface HeaderProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  className?: string;
}

export function Header({ currentPage, onNavigate, className = '' }: HeaderProps) {
  return (
    <header className={`bg-surface border-b border-border ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate('search')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onNavigate('search');
              }
            }}
          >
            <Shield className="w-8 h-8 text-primary-800" />
            <div>
              <h1 className="font-bold text-xl text-text-900">NewsCheck</h1>
              <p className="text-xs text-muted-500">Know what's true</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            <IconButton
              variant={currentPage === 'search' ? 'primary' : 'ghost'}
              onClick={() => onNavigate('search')}
              aria-label="Go to search"
              aria-current={currentPage === 'search' ? 'page' : undefined}
            >
              <Shield className="w-5 h-5" />
            </IconButton>
            
            <IconButton
              variant={currentPage === 'history' ? 'primary' : 'ghost'}
              onClick={() => onNavigate('history')}
              aria-label="View history"
              aria-current={currentPage === 'history' ? 'page' : undefined}
            >
              <History className="w-5 h-5" />
            </IconButton>
            
            <IconButton
              variant={currentPage === 'settings' ? 'primary' : 'ghost'}
              onClick={() => onNavigate('settings')}
              aria-label="Open settings"
              aria-current={currentPage === 'settings' ? 'page' : undefined}
            >
              <Settings className="w-5 h-5" />
            </IconButton>
          </nav>

          {/* Mobile menu button */}
          <IconButton
            variant="ghost"
            className="md:hidden"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </IconButton>
        </div>
      </div>
    </header>
  );
}