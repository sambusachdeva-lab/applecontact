import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  activeView: 'support' | 'genius' | 'directory' | 'icloud' | 'feedback';
  setActiveView: (view: 'support' | 'genius' | 'directory' | 'icloud' | 'feedback') => void;
  onPrimaryAction: () => void;
  primaryActionLabel: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  onPrimaryAction,
  primaryActionLabel,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'support', label: 'Support & Help' },
    { id: 'genius', label: 'Genius Bar' },
    { id: 'directory', label: 'Global Directory' },
    { id: 'icloud', label: 'iCloud Contacts' },
    { id: 'feedback', label: 'Feedback' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 border-b border-black/[0.06] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-12">
          {/* Zone 1: Single element Brand Wordmark */}
          <button
            onClick={() => setActiveView('support')}
            className="flex items-center gap-1.5 text-base font-semibold tracking-tight text-[#1d1d1f] hover:opacity-80 transition-opacity whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 170 170"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.7-11.64-13.99-6.3-9.77-11.17-20.91-14.6-33.42-3.43-12.51-5.15-24.32-5.15-35.43 0-15.65 3.9-28.78 11.69-39.38 7.8-10.6 17.51-16 29.13-16.21 4.57 0 9.77 1.25 15.6 3.76 5.83 2.51 9.4 3.79 10.72 3.79 1.1 0 4.88-1.32 11.36-3.97 6.47-2.65 11.83-3.84 16.07-3.56 12.39.84 22.37 5.75 29.93 14.74-10.96 6.64-16.32 15.74-16.07 27.31.25 9.09 3.77 16.69 10.55 22.8 6.78 6.12 14.75 9.68 23.91 10.69-2.46 7.63-5.59 15.11-9.38 22.44zM119.22 31.84c0-7.72 2.76-14.94 8.27-21.66 5.51-6.72 12.34-10.87 20.49-12.44.25 1.1.38 2.21.38 3.32 0 7.62-2.88 15.03-8.63 22.23-5.76 7.2-12.76 11.31-21 12.33-.12-1.22-.51-2.48-.51-3.78z" />
            </svg>
            <span>Apple Contact</span>
          </button>

          {/* Zone 2: 4-5 single-line clean navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-normal text-[#424245]">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#1d1d1f] cursor-pointer relative py-1 ${
                    isActive ? 'text-[#0071e3] font-medium' : ''
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#0071e3] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onPrimaryAction}
              className="px-3.5 py-1 text-xs font-normal text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] active:scale-[0.98] transition-all whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
            >
              {primaryActionLabel}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-zinc-600 hover:text-black rounded-md cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black/[0.06] bg-white px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2 px-3 rounded-lg text-sm ${
                activeView === item.id
                  ? 'bg-zinc-100 text-[#0071e3] font-medium'
                  : 'text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
