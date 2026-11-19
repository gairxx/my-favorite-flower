import React from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { formatEditorialDate, getDayOfYear, getSeasonForDate } from '../data/flowers';

interface DateRibbonProps {
  selectedDate: Date;
  isViewingCustomSpecimen: boolean;
  isToday: boolean;
  onPrevDay: () => void;
  onNextDay: () => void;
  onReturnToday: () => void;
}

export const DateRibbon: React.FC<DateRibbonProps> = ({
  selectedDate,
  isViewingCustomSpecimen,
  isToday,
  onPrevDay,
  onNextDay,
  onReturnToday,
}) => {
  const dayOfYear = getDayOfYear(selectedDate);
  const season = getSeasonForDate(selectedDate);

  return (
    <div className="border-b border-[#E3DDD1] bg-[#F6F2EA]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#57534E] tabular-nums">
          <span className="font-medium text-[#1C1917]">
            {isViewingCustomSpecimen ? 'Archival Specimen View' : formatEditorialDate(selectedDate)}
          </span>
          <span aria-hidden="true" className="text-[#B8AFA2]">·</span>
          <span>{season} Folio</span>
          {!isViewingCustomSpecimen && (
            <>
              <span aria-hidden="true" className="text-[#B8AFA2]">·</span>
              <span>Day {dayOfYear} of 365</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {(!isToday || isViewingCustomSpecimen) && (
            <button
              type="button"
              onClick={onReturnToday}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1B4332] hover:text-[#143326] border border-[#1B4332]/25 hover:border-[#1B4332]/50 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Return to Today</span>
            </button>
          )}
          <div className="inline-flex items-center border border-[#D8D0C2] rounded-md bg-[#FBF9F5]">
            <button
              type="button"
              onClick={onPrevDay}
              aria-label="Previous day's flower"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#44403C] hover:text-[#1C1917] hover:bg-[#EFEAE1] transition-colors rounded-l-md whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Previous Day</span>
            </button>
            <span className="w-px h-4 bg-[#D8D0C2]" aria-hidden="true" />
            <button
              type="button"
              onClick={onNextDay}
              aria-label="Next day's flower"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#44403C] hover:text-[#1C1917] hover:bg-[#EFEAE1] transition-colors rounded-r-md whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span className="hidden sm:inline">Next Day</span>
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
