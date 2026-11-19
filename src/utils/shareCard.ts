import { FlowerSpecimen } from '../types/flower';

export function buildShareUrl(flower: FlowerSpecimen, birthMonth?: number): string {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';
  url.searchParams.set('flower', flower.id);
  if (birthMonth) {
    url.searchParams.set('birthMonth', String(birthMonth));
  }
  return url.toString();
}

export function buildShareText(
  flower: FlowerSpecimen,
  contextLabel: string,
  shareUrl?: string
): string {
  const lines = [
    `${flower.commonName} (${flower.latinName}) — ${contextLabel}`,
    `Symbolism: ${flower.primaryVirtues.join(' · ')}`,
    '',
    ...flower.prosePoem,
    '',
    `“${flower.epigraph.quote}” — ${flower.epigraph.author}`,
  ];
  if (shareUrl) {
    lines.push('', `Read more at My Favorite Flower: ${shareUrl}`);
  }
  return lines.join('\n');
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Generates an archival museum-style PNG keepsake card for sharing on social feeds or messages.
 */
export function downloadFlowerKeepsakePng(
  flower: FlowerSpecimen,
  contextLabel: string
): boolean {
  try {
    const width = 1080;
    const height = 1350;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    // Archival paper canvas
    ctx.fillStyle = '#FBF9F5';
    ctx.fillRect(0, 0, width, height);

    // Outer & inner hairline framing
    ctx.strokeStyle = '#D8D0C2';
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 48, width - 96, height - 96);
    ctx.lineWidth = 1;
    ctx.strokeRect(64, 64, width - 128, height - 128);

    // Top kicker
    ctx.fillStyle = '#6B645B';
    ctx.font = '500 22px "DM Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      `${contextLabel.toUpperCase()}  ·  ${flower.plateNumber.toUpperCase()}`,
      width / 2,
      138
    );

    // Botanical pigment emblem (stylized rosette medallion in the flower's watercolor palette)
    const cx = width / 2;
    const cy = 360;
    const washGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 175);
    washGrad.addColorStop(0, flower.palette.wash);
    washGrad.addColorStop(1, 'rgba(251, 249, 245, 0)');
    ctx.fillStyle = washGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 175, 0, Math.PI * 2);
    ctx.fill();

    // 8 outer petals
    for (let i = 0; i < 8; i++) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((Math.PI * 2 * i) / 8);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-36, -34, -44, -98, 0, -118);
      ctx.bezierCurveTo(44, -98, 36, -34, 0, 0);
      ctx.fillStyle = flower.palette.primary;
      ctx.globalAlpha = 0.88;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#292524';
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.restore();
    }

    // 6 inner petals
    for (let i = 0; i < 6; i++) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((Math.PI * 2 * i) / 6 + 0.25);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-22, -22, -26, -64, 0, -76);
      ctx.bezierCurveTo(26, -64, 22, -22, 0, 0);
      ctx.fillStyle = flower.palette.secondary;
      ctx.fill();
      ctx.strokeStyle = '#292524';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();
    }

    // Center stamen
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fillStyle = flower.palette.center;
    ctx.fill();
    ctx.strokeStyle = '#292524';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Common & Latin Names
    ctx.fillStyle = '#1C1917';
    ctx.font = '500 74px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(flower.commonName, width / 2, 575);

    ctx.fillStyle = '#57534E';
    ctx.font = 'italic 32px "Source Serif 4", Georgia, serif';
    ctx.fillText(flower.latinName, width / 2, 628);

    // Virtues
    ctx.fillStyle = '#1B4332';
    ctx.font = '500 24px "DM Sans", sans-serif';
    ctx.fillText(flower.primaryVirtues.join('  ·  '), width / 2, 692);

    // Hairline divider
    ctx.strokeStyle = '#D8D0C2';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(220, 742);
    ctx.lineTo(width - 220, 742);
    ctx.stroke();

    // 4-line poetic stanza
    ctx.fillStyle = '#292524';
    ctx.font = 'italic 32px "Source Serif 4", Georgia, serif';
    let y = 812;
    for (const line of flower.prosePoem) {
      const wrapped = wrapLines(ctx, line, width - 240);
      for (const wLine of wrapped) {
        ctx.fillText(wLine, width / 2, y);
        y += 48;
      }
    }

    // Short essence
    ctx.fillStyle = '#57534E';
    ctx.font = '400 26px "Source Serif 4", Georgia, serif';
    const essenceLines = wrapLines(ctx, flower.shortEssence, width - 240);
    y += 34;
    for (const eLine of essenceLines) {
      ctx.fillText(eLine, width / 2, y);
      y += 38;
    }

    // Bottom brand colophon
    ctx.strokeStyle = '#D8D0C2';
    ctx.beginPath();
    ctx.moveTo(220, height - 165);
    ctx.lineTo(width - 220, height - 165);
    ctx.stroke();

    ctx.fillStyle = '#1C1917';
    ctx.font = '600 32px "Cormorant Garamond", Georgia, serif';
    ctx.fillText('My Favorite Flower', width / 2, height - 108);

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${flower.id}-my-favorite-flower.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch {
    return false;
  }
}
