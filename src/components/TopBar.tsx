import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface TopBarProps {
  activeSection: string;
  savedCount: number;
  onNavigateSection: (sectionId: string) => void;
  onOpenGarage: () => void;
  onGoHome: () => void;
}

const NAV_ITEMS = [
  { id: 'dispatches', label: 'Dispatches' },
  { id: 'galleries', label: 'Galleries' },
  { id: 'specifications', label: 'Specifications' },
  { id: 'compare', label: 'Compare' },
];

export function TopBar({
  activeSection,
  savedCount,
  onNavigateSection,
  onOpenGarage,
  onGoHome,
}: TopBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigateSection(id);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-[#E5E2DC]">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => {
            setMobileMenuOpen(false);
            onGoHome();
          }}
          className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-[#141416] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C81E1E] rounded-sm cursor-pointer"
        >
          Atelier Octane
        </button>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#55534E]"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C81E1E] rounded-sm ${
                  isActive
                    ? 'text-[#141416] font-semibold'
                    : 'text-[#55534E] hover:text-[#141416]'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 -bottom-0.5 h-[1.5px] bg-[#C81E1E] transition-transform duration-150 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenGarage}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#141416] hover:bg-[#C81E1E] transition-colors duration-150 rounded-md whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C81E1E] focus-visible:ring-offset-2"
          >
            {savedCount > 0 ? `Saved Garage (${savedCount})` : 'Saved Garage'}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 text-[#141416] hover:bg-[#EFECE6] rounded-md transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-[#E5E2DC] bg-[#FAF9F6] px-4 py-3 flex items-center justify-between gap-4 overflow-x-auto"
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`py-2 px-1 text-sm whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === item.id
                  ? 'text-[#C81E1E] font-semibold'
                  : 'text-[#55534E]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
