import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { FlowerSpecimen } from '../types/flower';
import { BotanicalPlate } from './BotanicalPlate';

interface PlateModalProps {
  flower: FlowerSpecimen | null;
  onClose: () => void;
}

export const PlateModal: React.FC<PlateModalProps> = ({ flower, onClose }) => {
  useEffect(() => {
    if (!flower) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [flower, onClose]);

  if (!flower) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="plate-modal-title"
    >
      <div
        className="fixed inset-0 bg-[#1C1917]/55 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-4xl bg-[#FBF9F5] border border-[#D8D0C2] rounded-md overflow-hidden max-h-[92vh] flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-[#F4EFE6] p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#E3DDD1]">
          <BotanicalPlate flower={flower} variant="modal" className="w-full max-w-sm" />
        </div>

        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.14em] uppercase text-[#6B645B] tabular-nums">
                {flower.plateNumber} · {flower.accessionCode}
              </p>
              <h2 id="plate-modal-title" className="font-display text-3xl font-medium text-[#1C1917] mt-1">
                {flower.commonName}
              </h2>
              <p className="font-prose italic text-base text-[#57534E]">
                {flower.latinName}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close plate inspection"
              className="p-2 text-[#57534E] hover:text-[#1C1917] rounded-md hover:bg-[#EFEAE1] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <dl className="mt-6 divide-y divide-[#E3DDD1] border-t border-b border-[#E3DDD1] text-sm">
            <div className="py-3 flex justify-between gap-4">
              <dt className="text-[#6B645B]">Botanical Family</dt>
              <dd className="font-medium text-[#1C1917] text-right">{flower.family}</dd>
            </div>
            <div className="py-3 flex justify-between gap-4">
              <dt className="text-[#6B645B]">Season &amp; Window</dt>
              <dd className="font-medium text-[#1C1917] text-right">
                {flower.season} · {flower.bloomWindow}
              </dd>
            </div>
            <div className="py-3 flex justify-between gap-4">
              <dt className="text-[#6B645B]">Native Habitat</dt>
              <dd className="font-medium text-[#1C1917] text-right">{flower.nativeOrigin}</dd>
            </div>
            <div className="py-3 flex justify-between gap-4">
              <dt className="text-[#6B645B]">Primary Virtues</dt>
              <dd className="font-medium text-[#1B4332] text-right">
                {flower.primaryVirtues.join(' · ')}
              </dd>
            </div>
          </dl>

          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.14em] text-[#6B645B] mb-2">
              Verse for the Specimen
            </p>
            <blockquote className="font-prose italic text-base text-[#292524] leading-relaxed space-y-1">
              {flower.prosePoem.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </blockquote>
          </div>

          <div className="mt-auto pt-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 text-xs font-medium text-[#FBF9F5] bg-[#1B4332] hover:bg-[#143326] rounded-md transition-colors cursor-pointer"
            >
              Return to Monograph
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
