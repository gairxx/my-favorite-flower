import React, { useEffect, useMemo, useState } from 'react';
import { Bookmark, BookmarkCheck, Check, Copy, Maximize2 } from 'lucide-react';
import {
  formatEditorialDate,
  getFlowerById,
  getFlowerForDate,
  isSameCalendarDay,
} from './data/flowers';
import { FlowerSpecimen, SavedFolioEntry } from './types/flower';
import { BotanicalPlate } from './components/BotanicalPlate';
import { DateRibbon } from './components/DateRibbon';
import { FolioDrawer } from './components/FolioDrawer';
import { Header } from './components/Header';
import { HerbariumArchive } from './components/HerbariumArchive';
import { PlateModal } from './components/PlateModal';

const STORAGE_KEY = 'florilegium_saved_folio_v1';

function loadSavedFolio(): SavedFolioEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [today] = useState<Date>(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [customSpecimen, setCustomSpecimen] = useState<FlowerSpecimen | null>(null);

  const [savedEntries, setSavedEntries] = useState<SavedFolioEntry[]>(loadSavedFolio);
  const [isFolioOpen, setIsFolioOpen] = useState(false);
  const [inspectedFlower, setInspectedFlower] = useState<FlowerSpecimen | null>(null);

  const [noteDraft, setNoteDraft] = useState('');
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);
  const [copiedVerse, setCopiedVerse] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedEntries));
    } catch {
      // Ignore storage quota errors
    }
  }, [savedEntries]);

  const dailyFlower = useMemo(() => getFlowerForDate(selectedDate), [selectedDate]);
  const activeFlower = customSpecimen ?? dailyFlower;
  const isToday = isSameCalendarDay(selectedDate, today);

  const existingFolioEntry = useMemo(
    () => savedEntries.find((e) => e.flowerId === activeFlower.id),
    [savedEntries, activeFlower.id]
  );

  // Keep reflection draft synced when switching flowers
  useEffect(() => {
    setNoteDraft(existingFolioEntry?.note ?? '');
    setNoteSavedFeedback(false);
  }, [activeFlower.id, existingFolioEntry?.note]);

  const companionFlowers = useMemo(
    () =>
      activeFlower.companionIds
        .map((id) => getFlowerById(id))
        .filter((f): f is FlowerSpecimen => Boolean(f)),
    [activeFlower.companionIds]
  );

  const handlePrevDay = () => {
    setCustomSpecimen(null);
    setSelectedDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() - 1);
      return next;
    });
  };

  const handleNextDay = () => {
    setCustomSpecimen(null);
    setSelectedDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + 1);
      return next;
    });
  };

  const handleReturnToday = () => {
    setCustomSpecimen(null);
    setSelectedDate(new Date(today));
  };

  const handleSelectDate = (date: Date) => {
    setCustomSpecimen(null);
    setSelectedDate(date);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSpecimen = (flower: FlowerSpecimen) => {
    setCustomSpecimen(flower);
  };

  const handleToggleSaveFolio = () => {
    setSavedEntries((prev) => {
      const exists = prev.some((e) => e.flowerId === activeFlower.id);
      if (exists) {
        return prev.filter((e) => e.flowerId !== activeFlower.id);
      }
      return [
        {
          flowerId: activeFlower.id,
          savedAt: new Date().toISOString(),
          note: noteDraft.trim(),
        },
        ...prev,
      ];
    });
  };

  const handleSaveReflectionNote = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = noteDraft.trim();
    setSavedEntries((prev) => {
      const exists = prev.some((item) => item.flowerId === activeFlower.id);
      if (exists) {
        return prev.map((item) =>
          item.flowerId === activeFlower.id ? { ...item, note: trimmed } : item
        );
      }
      return [
        {
          flowerId: activeFlower.id,
          savedAt: new Date().toISOString(),
          note: trimmed,
        },
        ...prev,
      ];
    });
    setNoteSavedFeedback(true);
    setTimeout(() => setNoteSavedFeedback(false), 2200);
  };

  const handleRemoveEntry = (flowerId: string) => {
    setSavedEntries((prev) => prev.filter((e) => e.flowerId !== flowerId));
  };

  const handleShareVerse = async () => {
    const formatted = [
      `${activeFlower.commonName} (${activeFlower.latinName})`,
      `${activeFlower.primaryVirtues.join(' · ')}`,
      '',
      activeFlower.prosePoem.join('\n'),
      '',
      `— Florilegium · ${formatEditorialDate(selectedDate)}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(formatted);
      setCopiedVerse(true);
      setTimeout(() => setCopiedVerse(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  const kickerLabel = customSpecimen
    ? 'Herbarium Monograph'
    : isToday
      ? 'Flower of Today'
      : `Almanac Entry · ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1917]">
      <Header
        savedCount={savedEntries.length}
        onOpenFolio={() => setIsFolioOpen(true)}
        onReturnToday={handleReturnToday}
      />

      <DateRibbon
        selectedDate={selectedDate}
        isViewingCustomSpecimen={Boolean(customSpecimen)}
        isToday={isToday}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
        onReturnToday={handleReturnToday}
      />

      <main className="flex-1">
        {/* Hero Specimen & Poetic Monograph */}
        <section id="todays-bloom" className="max-w-6xl mx-auto px-6 sm:px-8 pt-12 pb-16 sm:pt-16 sm:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Museum Botanical Plate */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <figure>
                <BotanicalPlate flower={activeFlower} variant="hero" />
                <figcaption className="mt-3 flex items-baseline justify-between gap-4 text-xs font-prose italic text-[#6B645B]">
                  <span>
                    Fig. 1 — {activeFlower.commonName}, folio study ({activeFlower.family})
                  </span>
                  <span className="not-italic font-sans text-[11px] tabular-nums shrink-0">
                    {activeFlower.bloomWindow}
                  </span>
                </figcaption>
              </figure>

              {/* Plate Action Controls */}
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setInspectedFlower(activeFlower)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#1C1917] bg-[#F4EFE6] hover:bg-[#EAE3D5] border border-[#D8D0C2] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Inspect Plate</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleSaveFolio}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    existingFolioEntry
                      ? 'bg-[#1B4332] text-[#FBF9F5] border-[#1B4332] hover:bg-[#143326]'
                      : 'bg-[#FBF9F5] text-[#1B4332] border-[#1B4332]/35 hover:bg-[#1B4332]/5'
                  }`}
                >
                  {existingFolioEntry ? (
                    <BookmarkCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : (
                    <Bookmark className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  <span>{existingFolioEntry ? 'Saved in Folio' : 'Save to Folio'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareVerse}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#57534E] hover:text-[#1C1917] border border-transparent hover:border-[#D8D0C2] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copiedVerse ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#1B4332]" aria-hidden="true" />
                      <span className="text-[#1B4332]">Verse Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Copy Verse</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Editorial Monograph */}
            <div className="lg:col-span-7">
              <div className="text-xs tracking-[0.14em] uppercase text-[#6B645B]">
                <span>{kickerLabel}</span>
                <span aria-hidden="true" className="mx-2">·</span>
                <span>{activeFlower.family}</span>
                <span aria-hidden="true" className="mx-2">·</span>
                <span>{activeFlower.nativeOrigin}</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#1C1917] mt-3 leading-[1.06] headline-balance">
                {activeFlower.commonName}
              </h1>

              <p className="font-prose italic text-xl text-[#57534E] mt-2">
                {activeFlower.latinName}
              </p>

              {/* Zero-pill Virtues Line */}
              <div className="mt-5 text-sm font-medium text-[#1B4332]">
                {activeFlower.primaryVirtues.map((virtue, idx) => (
                  <React.Fragment key={virtue}>
                    {idx > 0 && (
                      <span aria-hidden="true" className="mx-2.5 text-[#B8AFA2]">
                        ·
                      </span>
                    )}
                    <span>{virtue}</span>
                  </React.Fragment>
                ))}
              </div>

              {/* Epigraph framed by top & bottom hairline rules */}
              <blockquote className="mt-8 py-5 border-t border-b border-[#E3DDD1]">
                <p className="font-display italic text-2xl sm:text-[26px] text-[#292524] leading-snug">
                  &ldquo;{activeFlower.epigraph.quote}&rdquo;
                </p>
                <footer className="mt-2.5 text-xs tracking-wide text-[#6B645B]">
                  — {activeFlower.epigraph.author}
                </footer>
              </blockquote>

              {/* Poetic Essay with Editorial Drop Cap */}
              <div className="mt-8 max-w-prose space-y-5 font-prose text-[17px] leading-[1.82] text-[#292524]">
                {activeFlower.poeticEssay.map((paragraph, idx) => (
                  <p key={idx} className={idx === 0 ? 'drop-cap' : undefined}>
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Dedicated Verse for Today */}
              <div className="mt-10 p-6 sm:p-8 bg-[#F4EFE6] border border-[#E3DDD1] rounded-md max-w-prose">
                <p className="text-[11px] tracking-[0.16em] uppercase text-[#6B645B] mb-3">
                  Verse for the Bloom
                </p>
                <div className="font-prose italic text-lg text-[#1C1917] leading-relaxed space-y-1.5">
                  {activeFlower.prosePoem.map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cross-Cultural Floriography & Symbolism */}
        <section id="symbolism" className="border-t border-[#E3DDD1] bg-[#F6F2EA]/55 py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-6 sm:px-8">
            <div className="pb-8 border-b border-[#E3DDD1]">
              <p className="text-xs tracking-[0.16em] uppercase text-[#6B645B] mb-2">
                Lexicon of Floriography
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-medium text-[#1C1917] headline-balance">
                Symbolism Across Traditions
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E3DDD1] pt-2">
              <div className="py-7 md:pr-8">
                <h3 className="text-xs tracking-[0.14em] uppercase font-medium text-[#1B4332]">
                  01. Victorian Floriography
                </h3>
                <p className="font-prose text-base text-[#292524] leading-relaxed mt-3">
                  {activeFlower.floriography.victorian}
                </p>
              </div>

              <div className="py-7 md:px-8">
                <h3 className="text-xs tracking-[0.14em] uppercase font-medium text-[#1B4332]">
                  02. Eastern &amp; Classical Lineage
                </h3>
                <p className="font-prose text-base text-[#292524] leading-relaxed mt-3">
                  {activeFlower.floriography.eastern}
                </p>
              </div>

              <div className="py-7 md:pl-8">
                <h3 className="text-xs tracking-[0.14em] uppercase font-medium text-[#1B4332]">
                  03. Myth &amp; Folklore
                </h3>
                <p className="font-prose text-base text-[#292524] leading-relaxed mt-3">
                  {activeFlower.floriography.mythic}
                </p>
              </div>
            </div>

            {/* Asymmetric Contemplation + Companion Pairings */}
            <div className="mt-10 pt-10 border-t border-[#E3DDD1] grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-7 bg-[#FBF9F5] border border-[#E3DDD1] rounded-md p-6 sm:p-8">
                <p className="text-xs tracking-[0.14em] uppercase text-[#6B645B]">
                  Daily Contemplation
                </p>
                <p className="font-display text-2xl sm:text-[26px] text-[#1C1917] leading-snug mt-2">
                  {activeFlower.contemplationPrompt}
                </p>

                <form onSubmit={handleSaveReflectionNote} className="mt-5">
                  <label htmlFor="reflection-note" className="sr-only">
                    Personal reflection note
                  </label>
                  <textarea
                    id="reflection-note"
                    rows={3}
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    placeholder="Record a brief thought, dedication, or memory beside this flower..."
                    className="w-full p-3.5 text-sm font-prose bg-[#F6F2EA] border border-[#D8D0C2] rounded-md text-[#1C1917] placeholder:text-[#8C8479] focus:outline-none focus:border-[#1B4332] resize-y"
                  />
                  <div className="mt-3 flex items-center justify-between gap-4">
                    <span className="text-xs text-[#6B645B]">
                      {noteSavedFeedback
                        ? 'Reflection saved to your Pressed Folio.'
                        : 'Saved privately in this browser.'}
                    </span>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-medium text-[#FBF9F5] bg-[#1B4332] hover:bg-[#143326] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Save Note to Folio
                    </button>
                  </div>
                </form>
              </div>

              <div className="lg:col-span-5">
                <p className="text-xs tracking-[0.14em] uppercase text-[#6B645B] mb-4">
                  In Dialogue With
                </p>
                <div className="space-y-4">
                  {companionFlowers.map((companion) => (
                    <button
                      key={companion.id}
                      type="button"
                      onClick={() => {
                        handleSelectSpecimen(companion);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full text-left p-4 bg-[#FBF9F5] border border-[#E3DDD1] hover:border-[#1B4332]/60 rounded-md transition-colors flex items-center gap-4 group cursor-pointer"
                    >
                      <div className="w-20 shrink-0">
                        <BotanicalPlate flower={companion} variant="card" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] uppercase tracking-[0.12em] text-[#6B645B]">
                          {companion.season} · {companion.primaryVirtues[0]}
                        </div>
                        <div className="font-display text-xl font-medium text-[#1C1917] group-hover:text-[#1B4332] transition-colors truncate mt-0.5">
                          {companion.commonName}
                        </div>
                        <div className="font-prose italic text-xs text-[#6B645B] truncate">
                          {companion.latinName}
                        </div>
                      </div>
                      <span
                        aria-hidden="true"
                        className="text-sm text-[#6B645B] group-hover:text-[#1B4332] group-hover:translate-x-0.5 transition-all"
                      >
                        →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Almanac Calendar & Seasonal Herbarium Archive */}
        <HerbariumArchive
          activeFlowerId={activeFlower.id}
          selectedDate={selectedDate}
          onSelectFlower={handleSelectSpecimen}
          onSelectDate={handleSelectDate}
        />
      </main>

      {/* Editorial Colophon Footer */}
      <footer className="border-t border-[#E3DDD1] bg-[#FBF9F5] py-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#6B645B]">
          <div>
            <span className="font-display text-base font-semibold text-[#1C1917]">Florilegium</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>A Seasonal Almanac of Botanical Symbolism &amp; Floriography</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#todays-bloom" className="hover:text-[#1C1917] transition-colors">
              Today&rsquo;s Bloom
            </a>
            <a href="#symbolism" className="hover:text-[#1C1917] transition-colors">
              Symbolism
            </a>
            <a href="#herbarium" className="hover:text-[#1C1917] transition-colors">
              Herbarium
            </a>
          </div>
        </div>
      </footer>

      <FolioDrawer
        isOpen={isFolioOpen}
        entries={savedEntries}
        onClose={() => setIsFolioOpen(false)}
        onSelectFlower={handleSelectSpecimen}
        onRemoveEntry={handleRemoveEntry}
      />

      <PlateModal
        flower={inspectedFlower}
        onClose={() => setInspectedFlower(null)}
      />
    </div>
  );
}

