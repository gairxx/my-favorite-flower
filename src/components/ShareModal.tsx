import React, { useEffect, useMemo, useState } from 'react';
import { Check, Copy, Download, Link2, Mail, Share2, X } from 'lucide-react';
import { FlowerSpecimen } from '../types/flower';
import {
  buildShareText,
  buildShareUrl,
  downloadFlowerKeepsakePng,
} from '../utils/shareCard';

interface ShareModalProps {
  isOpen: boolean;
  flower: FlowerSpecimen;
  contextLabel: string;
  birthMonth?: number;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  flower,
  contextLabel,
  birthMonth,
  onClose,
}) => {
  const [copiedState, setCopiedState] = useState<'none' | 'link' | 'verse'>('none');
  const [downloadedCard, setDownloadedCard] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setCopiedState('none');
    setDownloadedCard(false);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const shareUrl = useMemo(
    () => buildShareUrl(flower, birthMonth),
    [flower, birthMonth]
  );

  const shareText = useMemo(
    () => buildShareText(flower, contextLabel, shareUrl),
    [flower, contextLabel, shareUrl]
  );

  if (!isOpen) return null;

  const canUseNativeShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const handleNativeShare = async () => {
    if (!canUseNativeShare) return;
    try {
      await navigator.share({
        title: `${flower.commonName} — My Favorite Flower`,
        text: buildShareText(flower, contextLabel),
        url: shareUrl,
      });
    } catch {
      // User dismissed native share sheet
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedState('link');
      setTimeout(() => setCopiedState('none'), 2000);
    } catch {
      // Clipboard blocked
    }
  };

  const handleCopyPoeticText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedState('verse');
      setTimeout(() => setCopiedState('none'), 2000);
    } catch {
      // Clipboard blocked
    }
  };

  const handleDownloadKeepsake = () => {
    const ok = downloadFlowerKeepsakePng(flower, contextLabel);
    if (ok) {
      setDownloadedCard(true);
      setTimeout(() => setDownloadedCard(false), 2400);
    }
  };

  const mailtoHref = `mailto:?subject=${encodeURIComponent(
    `${flower.commonName} (${flower.latinName}) — My Favorite Flower`
  )}&body=${encodeURIComponent(shareText)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div
        className="fixed inset-0 bg-[#1C1917]/45 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-lg bg-[#FBF9F5] border border-[#D8D0C2] rounded-md overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E3DDD1] flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#6B645B]">
              {contextLabel}
            </p>
            <h2
              id="share-modal-title"
              className="font-display text-2xl sm:text-3xl font-medium text-[#1C1917] mt-0.5"
            >
              Share {flower.commonName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close share dialog"
            className="p-2 text-[#57534E] hover:text-[#1C1917] rounded-md hover:bg-[#EFEAE1] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Preview card */}
          <div className="p-4 bg-[#F4EFE6] border border-[#E3DDD1] rounded-md">
            <div className="text-xs font-medium text-[#1B4332]">
              {flower.primaryVirtues.join(' · ')}
            </div>
            <div className="font-prose italic text-sm text-[#292524] mt-2 leading-relaxed space-y-0.5">
              {flower.prosePoem.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </div>

          {/* Direct link readout */}
          <div>
            <label
              htmlFor="share-direct-url"
              className="block text-[11px] uppercase tracking-[0.14em] text-[#6B645B] mb-1.5"
            >
              Direct Specimen Link
            </label>
            <div className="flex items-center gap-2">
              <input
                id="share-direct-url"
                type="text"
                readOnly
                value={shareUrl}
                onFocus={(e) => e.currentTarget.select()}
                className="flex-1 min-w-0 px-3 py-2 text-xs bg-[#F4EFE6] border border-[#D8D0C2] rounded-md text-[#44403C] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#1C1917] bg-[#F4EFE6] hover:bg-[#EAE3D5] border border-[#D8D0C2] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {copiedState === 'link' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#1B4332]" aria-hidden="true" />
                    <span className="text-[#1B4332]">Copied</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Share Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {canUseNativeShare && (
              <button
                type="button"
                onClick={handleNativeShare}
                className="sm:col-span-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-[#FBF9F5] bg-[#1B4332] hover:bg-[#143326] rounded-md transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Share via Device</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopyPoeticText}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-[#1C1917] bg-[#F4EFE6] hover:bg-[#EAE3D5] border border-[#D8D0C2] rounded-md transition-colors cursor-pointer"
            >
              {copiedState === 'verse' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#1B4332]" aria-hidden="true" />
                  <span className="text-[#1B4332]">Poetic Text Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Copy Poetic Excerpt</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadKeepsake}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-[#1C1917] bg-[#F4EFE6] hover:bg-[#EAE3D5] border border-[#D8D0C2] rounded-md transition-colors cursor-pointer"
            >
              {downloadedCard ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#1B4332]" aria-hidden="true" />
                  <span className="text-[#1B4332]">Card Downloaded</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Download Keepsake PNG</span>
                </>
              )}
            </button>

            <a
              href={mailtoHref}
              className="sm:col-span-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-[#44403C] hover:text-[#1C1917] border border-[#E3DDD1] hover:border-[#D8D0C2] rounded-md transition-colors"
            >
              <Mail className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Send via Email</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
