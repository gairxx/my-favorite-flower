import React, { useMemo, useState } from 'react';
import { Calendar, Search } from 'lucide-react';
import { FLOWERS, getFlowerForDate } from '../data/flowers';
import { FlowerSpecimen, Season } from '../types/flower';
import { BotanicalPlate } from './BotanicalPlate';

interface HerbariumArchiveProps {
  activeFlowerId: string;
  selectedDate: Date;
  onSelectFlower: (flower: FlowerSpecimen) => void;
  onSelectDate: (date: Date) => void;
}

const SEASONS: Array<'All' | Season> = ['All', 'Autumn', 'Winter', 'Spring', 'Summer'];

export const HerbariumArchive: React.FC<HerbariumArchiveProps> = ({
  activeFlowerId,
  selectedDate,
  onSelectFlower,
  onSelectDate,
}) => {
  const [seasonFilter, setSeasonFilter] = useState<'All' | Season>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFlowers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FLOWERS.filter((f) => {
      const matchesSeason = seasonFilter === 'All' || f.season === seasonFilter;
      if (!matchesSeason) return false;
      if (!q) return true;
      return (
        f.commonName.toLowerCase().includes(q) ||
        f.latinName.toLowerCase().includes(q) ||
        f.shortEssence.toLowerCase().includes(q) ||
        f.primaryVirtues.some((v) => v.toLowerCase().includes(q)) ||
        f.floriography.victorian.toLowerCase().includes(q)
      );
    });
  }, [seasonFilter, searchQuery]);

  // Build a 7-day almanac window centered around the selected date
  const calendarStrip = useMemo(() => {
    return Array.from({ length: 7 }).map((_, idx) => {
      const offset = idx - 3;
      const d = new Date(selectedDate);
      d.setDate(selectedDate.getDate() + offset);
      return {
        date: d,
        flower: getFlowerForDate(d),
        isSelected: offset === 0,
      };
    });
  }, [selectedDate]);

  const dateInputValue = useMemo(() => {
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const d = String(selectedDate.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;
    const [year, month, day] = val.split('-').map(Number);
    if (!year || !month || !day) return;
    onSelectDate(new Date(year, month - 1, day, 12, 0, 0));
  };

  return (
    <>
      {/* Almanac Calendar Section */}
      <section id="almanac" className="border-t border-[#E3DDD1] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E3DDD1]">
            <div>
              <p className="text-xs tracking-[0.16em] uppercase text-[#6B645B] mb-2">
                Almanac Calendar
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-medium text-[#1C1917] headline-balance">
                Discover the Bloom for Any Date
              </h2>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <label
                htmlFor="almanac-date-picker"
                className="text-xs font-medium text-[#57534E] whitespace-nowrap"
              >
                Jump to date
              </label>
              <div className="relative flex items-center">
                <Calendar
                  className="w-4 h-4 text-[#6B645B] absolute left-3 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="almanac-date-picker"
                  type="date"
                  value={dateInputValue}
                  onChange={handleDateChange}
                  className="pl-9 pr-3 py-2 text-sm text-[#1C1917] bg-[#FBF9F5] border border-[#D8D0C2] rounded-md tabular-nums focus:outline-none focus:border-[#1B4332]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-8">
            {calendarStrip.map(({ date, flower, isSelected }) => {
              const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
              const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => onSelectDate(date)}
                  className={`text-left p-4 rounded-md border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#EFEAE1] border-[#1B4332]'
                      : 'bg-[#FBF9F5] border-[#E3DDD1] hover:border-[#B8AFA2] hover:bg-[#F6F2EA]'
                  }`}
                >
                  <div className="text-[11px] uppercase tracking-[0.12em] text-[#6B645B] tabular-nums">
                    {weekday} · {monthDay}
                  </div>
                  <div className="font-display text-lg font-semibold text-[#1C1917] mt-2 leading-snug">
                    {flower.commonName}
                  </div>
                  <div className="text-xs italic font-prose text-[#57534E] mt-1 truncate">
                    {flower.latinName}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Seasonal Herbarium Archive */}
      <section id="herbarium" className="border-t border-[#E3DDD1] bg-[#F6F2EA]/70 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#E3DDD1]">
            <div className="max-w-xl">
              <p className="text-xs tracking-[0.16em] uppercase text-[#6B645B] mb-2">
                Curated Herbarium
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-medium text-[#1C1917] headline-balance">
                Twenty-Four Seasonal Specimens
              </h2>
              <p className="font-prose text-base text-[#57534E] mt-2 leading-relaxed">
                Browse the complete folio by season or search by meaning, virtue, or botanical name.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Functional season filter tabs */}
              <div
                role="tablist"
                aria-label="Filter herbarium by season"
                className="inline-flex items-center p-1 bg-[#EBE5D9] rounded-md overflow-x-auto"
              >
                {SEASONS.map((s) => {
                  const active = seasonFilter === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSeasonFilter(s)}
                      className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-[#FBF9F5] text-[#1C1917]'
                          : 'text-[#57534E] hover:text-[#1C1917]'
                      }`}
                    >
                      {s === 'All' ? 'All Seasons' : s}
                    </button>
                  );
                })}
              </div>

              {/* Search by name or symbolism */}
              <div className="relative">
                <Search
                  className="w-4 h-4 text-[#6B645B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search bloom or meaning..."
                  aria-label="Search bloom or meaning"
                  className="w-full sm:w-56 pl-9 pr-3 py-2 text-sm bg-[#FBF9F5] border border-[#D8D0C2] rounded-md text-[#1C1917] placeholder:text-[#8C8479] focus:outline-none focus:border-[#1B4332]"
                />
              </div>
            </div>
          </div>

          {filteredFlowers.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-display text-2xl text-[#1C1917]">
                No specimen matches &ldquo;{searchQuery}&rdquo;
              </p>
              <p className="text-sm text-[#57534E] mt-2">
                Try searching for virtues such as remembrance, hope, courage, or devotion.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSeasonFilter('All');
                  setSearchQuery('');
                }}
                className="mt-5 px-4 py-2 text-xs font-medium text-[#1B4332] border border-[#1B4332]/30 rounded-md hover:bg-[#1B4332]/5 transition-colors cursor-pointer"
              >
                Reset Archive Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 pt-10">
              {filteredFlowers.map((flower) => {
                const isActive = flower.id === activeFlowerId;
                return (
                  <article
                    key={flower.id}
                    className={`group bg-[#FBF9F5] border rounded-md transition-colors flex flex-col ${
                      isActive ? 'border-[#1B4332]' : 'border-[#E3DDD1] hover:border-[#B8AFA2]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelectFlower(flower);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-left flex-1 flex flex-col cursor-pointer"
                    >
                      <BotanicalPlate flower={flower} variant="card" className="border-0 border-b border-[#E3DDD1]" />
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="text-xs text-[#6B645B] tracking-wide">
                          <span>{flower.plateNumber}</span>
                          <span aria-hidden="true" className="mx-1.5">·</span>
                          <span>{flower.season}</span>
                          <span aria-hidden="true" className="mx-1.5">·</span>
                          <span>{flower.primaryVirtues[0]}</span>
                        </div>
                        <h3 className="font-display text-2xl font-medium text-[#1C1917] group-hover:text-[#1B4332] transition-colors mt-2">
                          {flower.commonName}
                        </h3>
                        <p className="font-prose italic text-sm text-[#6B645B]">
                          {flower.latinName}
                        </p>
                        <p className="font-prose text-sm text-[#44403C] leading-relaxed mt-3 line-clamp-2">
                          {flower.shortEssence}
                        </p>
                        <div className="mt-auto pt-5 flex items-center justify-between text-xs font-medium text-[#1B4332]">
                          <span>{isActive ? 'Currently Viewing' : 'Read Monograph'}</span>
                          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                        </div>
                      </div>
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
