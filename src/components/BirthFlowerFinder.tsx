import React, { useMemo, useState } from 'react';
import { Share2 } from 'lucide-react';
import { BIRTH_MONTHS, getBirthMonthGuide } from '../data/birthFlowers';
import { getFlowerById, getFlowerForDate } from '../data/flowers';
import { FlowerSpecimen } from '../types/flower';
import { BotanicalPlate } from './BotanicalPlate';

interface BirthFlowerFinderProps {
  initialMonth?: number;
  onSelectFlower: (flower: FlowerSpecimen) => void;
  onShareFlower: (flower: FlowerSpecimen, contextLabel: string, birthMonth?: number) => void;
}

export const BirthFlowerFinder: React.FC<BirthFlowerFinderProps> = ({
  initialMonth,
  onSelectFlower,
  onShareFlower,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(
    initialMonth && initialMonth >= 1 && initialMonth <= 12
      ? initialMonth
      : new Date().getMonth() + 1
  );
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());

  const guide = useMemo(() => getBirthMonthGuide(selectedMonth), [selectedMonth]);

  const clampedDay = Math.min(selectedDay, guide.daysInMonth);

  const primaryFlower = useMemo(
    () => getFlowerById(guide.primaryFlowerId),
    [guide.primaryFlowerId]
  );

  const secondaryFlower = useMemo(
    () => getFlowerById(guide.secondaryFlowerId),
    [guide.secondaryFlowerId]
  );

  const exactBirthdayFlower = useMemo(() => {
    const birthDate = new Date(2026, selectedMonth - 1, clampedDay, 12, 0, 0);
    return getFlowerForDate(birthDate);
  }, [selectedMonth, clampedDay]);

  if (!primaryFlower) return null;

  return (
    <section
      id="birth-flower"
      className="border-t border-[#E3DDD1] bg-[#FBF9F5] py-16 sm:py-24"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#E3DDD1]">
          <div className="max-w-xl">
            <p className="text-xs tracking-[0.16em] uppercase text-[#6B645B] mb-2">
              Birth Month Floriography
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-[#1C1917] headline-balance">
              Find Your Birth Flower
            </h2>
            <p className="font-prose text-base text-[#57534E] mt-2 leading-relaxed">
              Select your birth month and day to uncover your traditional birth flower, secondary companion bloom, and exact birthday almanac flower.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <label htmlFor="birth-day-select" className="text-xs font-medium text-[#57534E] whitespace-nowrap">
              Birth Day
            </label>
            <select
              id="birth-day-select"
              value={clampedDay}
              onChange={(e) => setSelectedDay(Number(e.target.value))}
              className="px-3 py-2 text-sm bg-[#F4EFE6] border border-[#D8D0C2] rounded-md text-[#1C1917] tabular-nums focus:outline-none focus:border-[#1B4332] cursor-pointer"
            >
              {Array.from({ length: guide.daysInMonth }).map((_, idx) => {
                const day = idx + 1;
                return (
                  <option key={day} value={day}>
                    {guide.shortName} {day}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* 12-Month Selector Strip */}
        <div
          role="tablist"
          aria-label="Select birth month"
          className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2 pt-8"
        >
          {BIRTH_MONTHS.map((item) => {
            const active = item.month === selectedMonth;
            return (
              <button
                key={item.month}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedMonth(item.month)}
                className={`py-2.5 px-2 text-xs font-medium rounded-md border transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#1B4332] text-[#FBF9F5] border-[#1B4332]'
                    : 'bg-[#F4EFE6] text-[#44403C] border-[#E3DDD1] hover:border-[#B8AFA2] hover:text-[#1C1917]'
                }`}
              >
                {item.shortName}
              </button>
            );
          })}
        </div>

        {/* Birth Flower Result Spread */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Primary Birth Month Plate */}
          <div className="lg:col-span-5">
            <BotanicalPlate flower={primaryFlower} variant="hero" />
          </div>

          {/* Birth Portrait & Companion Details */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="text-xs tracking-[0.14em] uppercase text-[#6B645B]">
              <span>{guide.monthName} Birth Flower</span>
              <span aria-hidden="true" className="mx-2">·</span>
              <span>{guide.temperamentTitle}</span>
            </div>

            <h3 className="font-display text-4xl sm:text-5xl font-medium text-[#1C1917] mt-2 leading-tight headline-balance">
              {primaryFlower.commonName}
            </h3>
            <p className="font-prose italic text-lg text-[#57534E] mt-1">
              {primaryFlower.latinName} · {primaryFlower.family}
            </p>

            <div className="mt-4 text-sm font-medium text-[#1B4332]">
              {primaryFlower.primaryVirtues.join(' · ')}
            </div>

            <p className="font-prose text-[17px] leading-[1.8] text-[#292524] mt-6 max-w-prose">
              {guide.birthPortrait}
            </p>

            {/* Poem excerpt */}
            <blockquote className="mt-6 py-4 border-t border-b border-[#E3DDD1] font-prose italic text-base text-[#292524] leading-relaxed space-y-1 max-w-prose">
              {primaryFlower.prosePoem.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </blockquote>

            {/* Action buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onSelectFlower(primaryFlower);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 text-xs font-medium text-[#FBF9F5] bg-[#1B4332] hover:bg-[#143326] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Read Full Monograph
              </button>

              <button
                type="button"
                onClick={() =>
                  onShareFlower(
                    primaryFlower,
                    `${guide.monthName} Birth Flower`,
                    guide.month
                  )
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#1C1917] bg-[#F4EFE6] hover:bg-[#EAE3D5] border border-[#D8D0C2] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Share Birth Flower</span>
              </button>
            </div>

            {/* Secondary Month Companion & Exact Birthday Almanac Match */}
            <div className="mt-8 pt-6 border-t border-[#E3DDD1] grid grid-cols-1 sm:grid-cols-2 gap-4">
              {secondaryFlower && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectFlower(secondaryFlower);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-left p-4 bg-[#F4EFE6] border border-[#E3DDD1] hover:border-[#1B4332]/50 rounded-md transition-colors group cursor-pointer"
                >
                  <div className="text-[11px] uppercase tracking-[0.12em] text-[#6B645B]">
                    Secondary {guide.shortName} Bloom
                  </div>
                  <div className="font-display text-xl font-medium text-[#1C1917] group-hover:text-[#1B4332] transition-colors mt-1">
                    {secondaryFlower.commonName}
                  </div>
                  <div className="font-prose italic text-xs text-[#57534E] mt-0.5">
                    {secondaryFlower.primaryVirtues[0]} · {secondaryFlower.primaryVirtues[1]}
                  </div>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  onSelectFlower(exactBirthdayFlower);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-left p-4 bg-[#F4EFE6] border border-[#E3DDD1] hover:border-[#1B4332]/50 rounded-md transition-colors group cursor-pointer"
              >
                <div className="text-[11px] uppercase tracking-[0.12em] text-[#6B645B] tabular-nums">
                  Exact Day Bloom · {guide.shortName} {clampedDay}
                </div>
                <div className="font-display text-xl font-medium text-[#1C1917] group-hover:text-[#1B4332] transition-colors mt-1">
                  {exactBirthdayFlower.commonName}
                </div>
                <div className="font-prose italic text-xs text-[#57534E] mt-0.5">
                  {exactBirthdayFlower.primaryVirtues[0]} · {exactBirthdayFlower.primaryVirtues[1]}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
