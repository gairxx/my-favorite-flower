import React, { useEffect, useState } from 'react';
import { Check, Copy, Trash2, X } from 'lucide-react';
import { getFlowerById } from '../data/flowers';
import { FlowerSpecimen, SavedFolioEntry } from '../types/flower';

interface FolioDrawerProps {
  isOpen: boolean;
  entries: SavedFolioEntry[];
  onClose: () => void;
  onSelectFlower: (flower: FlowerSpecimen) => void;
  onRemoveEntry: (flowerId: string) => void;
}

export const FolioDrawer: React.FC<FolioDrawerProps> = ({
  isOpen,
  entries,
  onClose,
  onSelectFlower,
  onRemoveEntry,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyExcerpt = async (flower: FlowerSpecimen) => {
    const excerpt = [
      `${flower.commonName} (${flower.latinName})`,
      `Symbolism: ${flower.primaryVirtues.join(' · ')}`,
      '',
      flower.prosePoem.join('\n'),
      '',
      `— ${flower.epigraph.quote} (${flower.epigraph.author})`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(excerpt);
      setCopiedId(flower.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Clipboard API unavailable in restricted contexts
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="folio-drawer-title"
    >
      <div
        className="fixed inset-0 bg-[#1C1917]/35 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className="relative z-10 w-full max-w-md bg-[#FBF9F5] border-l border-[#D8D0C2] h-full flex flex-col">
        <div className="px-6 py-5 border-b border-[#E3DDD1] flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#6B645B]">
              Personal Collection
            </p>
            <h2 id="folio-drawer-title" className="font-display text-2xl font-medium text-[#1C1917]">
              Pressed Herbarium Folio
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close saved folio"
            className="p-2 text-[#57534E] hover:text-[#1C1917] rounded-md hover:bg-[#EFEAE1] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {entries.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-display text-2xl text-[#1C1917]">
                Your folio pages are empty
              </p>
              <p className="font-prose text-sm text-[#57534E] mt-2 leading-relaxed max-w-xs mx-auto">
                Save today&rsquo;s flower or any seasonal specimen from the herbarium to build your personal anthology of meanings.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[#E3DDD1]">
              {entries.map((entry) => {
                const flower = getFlowerById(entry.flowerId);
                if (!flower) return null;
                const isCopied = copiedId === flower.id;

                return (
                  <li key={entry.flowerId} className="py-5 first:pt-0">
                    <div className="flex items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectFlower(flower);
                          onClose();
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-left group cursor-pointer"
                      >
                        <div className="text-[11px] tracking-[0.12em] uppercase text-[#6B645B]">
                          {flower.plateNumber} · {flower.season}
                        </div>
                        <h3 className="font-display text-xl font-medium text-[#1C1917] group-hover:text-[#1B4332] transition-colors mt-0.5">
                          {flower.commonName}
                        </h3>
                        <p className="font-prose italic text-xs text-[#6B645B]">
                          {flower.latinName}
                        </p>
                      </button>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopyExcerpt(flower)}
                          aria-label={`Copy poetic excerpt for ${flower.commonName}`}
                          title="Copy poetic excerpt"
                          className="p-2 text-[#57534E] hover:text-[#1B4332] rounded-md hover:bg-[#EFEAE1] transition-colors cursor-pointer"
                        >
                          {isCopied ? (
                            <Check className="w-4 h-4 text-[#1B4332]" aria-hidden="true" />
                          ) : (
                            <Copy className="w-4 h-4" aria-hidden="true" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveEntry(flower.id)}
                          aria-label={`Remove ${flower.commonName} from folio`}
                          title="Remove from folio"
                          className="p-2 text-[#57534E] hover:text-[#991B1B] rounded-md hover:bg-[#EFEAE1] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#57534E] mt-2">
                      {flower.primaryVirtues.join(' · ')}
                    </p>

                    {entry.note.trim() && (
                      <div className="mt-3 p-3 bg-[#F4EFE6] border border-[#E3DDD1] rounded text-xs font-prose text-[#44403C] leading-relaxed">
                        &ldquo;{entry.note}&rdquo;
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
};
