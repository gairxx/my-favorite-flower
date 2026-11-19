import React from 'react';

interface HeaderProps {
  savedCount: number;
  onOpenFolio: () => void;
  onReturnToday: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  savedCount,
  onOpenFolio,
  onReturnToday,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FBF9F5]/95 backdrop-blur-sm border-b border-[#E3DDD1]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#todays-bloom"
          onClick={(e) => {
            e.preventDefault();
            onReturnToday();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-display text-2xl font-semibold tracking-tight text-[#1C1917] hover:text-[#1B4332] transition-colors whitespace-nowrap shrink-0"
        >
          My Favorite Flower
        </a>

        {/* Zone 2: 4 Single-line Navigation Links */}
        <nav
          aria-label="Primary sections"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#57534E]"
        >
          <a
            href="#todays-bloom"
            className="hover:text-[#1C1917] hover:underline underline-offset-4 decoration-[#1B4332]/40 transition-colors whitespace-nowrap shrink-0"
          >
            Today&rsquo;s Bloom
          </a>
          <a
            href="#birth-flower"
            className="hover:text-[#1C1917] hover:underline underline-offset-4 decoration-[#1B4332]/40 transition-colors whitespace-nowrap shrink-0"
          >
            Birth Flower
          </a>
          <a
            href="#symbolism"
            className="hover:text-[#1C1917] hover:underline underline-offset-4 decoration-[#1B4332]/40 transition-colors whitespace-nowrap shrink-0"
          >
            Symbolism
          </a>
          <a
            href="#herbarium"
            className="hover:text-[#1C1917] hover:underline underline-offset-4 decoration-[#1B4332]/40 transition-colors whitespace-nowrap shrink-0"
          >
            Herbarium
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action Button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenFolio}
            className="px-4 py-2 text-xs font-medium tracking-wide text-[#FBF9F5] bg-[#1B4332] hover:bg-[#143326] rounded-md transition-colors whitespace-nowrap shrink-0 tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] cursor-pointer"
          >
            Saved Folio · {savedCount}
          </button>
        </div>
      </div>
    </header>
  );
};
