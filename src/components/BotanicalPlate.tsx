import React from 'react';
import { FlowerSpecimen } from '../types/flower';

interface BotanicalPlateProps {
  flower: FlowerSpecimen;
  variant?: 'hero' | 'card' | 'modal';
  className?: string;
}

export const BotanicalPlate: React.FC<BotanicalPlateProps> = ({
  flower,
  variant = 'hero',
  className = '',
}) => {
  const { palette, archetype, plateNumber, accessionCode, latinName } = flower;
  const uid = `${flower.id}-${variant}`;

  const renderFoliageAndStem = () => {
    switch (archetype) {
      case 'wisteria':
        return (
          <g>
            {/* Arching woody vine across upper frame */}
            <path
              d="M 48 64 Q 145 48, 220 84 T 315 72"
              fill="none"
              stroke="#4A3F35"
              strokeWidth="4.2"
              strokeLinecap="round"
            />
            <path
              d="M 75 58 Q 160 44, 240 78"
              fill="none"
              stroke="#6B5E52"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.7"
            />
            {/* Pinnate leaves along vine */}
            {[
              { x: 96, y: 62, rot: -28 },
              { x: 145, y: 58, rot: -15 },
              { x: 245, y: 76, rot: 22 },
            ].map((leaf, idx) => (
              <g key={idx} transform={`translate(${leaf.x}, ${leaf.y}) rotate(${leaf.rot})`}>
                <path
                  d="M 0 0 Q -12 -22, 0 -46 Q 12 -22, 0 0 Z"
                  fill={palette.foliage}
                  fillOpacity="0.88"
                  stroke="#292524"
                  strokeWidth="0.9"
                />
                <line x1="0" y1="-2" x2="0" y2="-44" stroke="#FBF9F5" strokeWidth="0.6" strokeOpacity="0.45" />
              </g>
            ))}
          </g>
        );
      case 'bluebell':
      case 'snowdrop':
        return (
          <g>
            {/* Basal strap leaves */}
            <path
              d="M 164 415 Q 128 310, 114 215 Q 130 295, 174 412 Z"
              fill={palette.foliage}
              fillOpacity="0.9"
              stroke="#292524"
              strokeWidth="0.9"
            />
            <path
              d="M 184 415 Q 222 300, 236 228 Q 214 312, 194 414 Z"
              fill={palette.foliage}
              fillOpacity="0.82"
              stroke="#292524"
              strokeWidth="0.9"
            />
            {/* Arching shepherd's crook stem */}
            <path
              d="M 178 415 C 175 295, 170 155, 214 118 C 242 96, 266 116, 262 142"
              fill="none"
              stroke={palette.foliage}
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </g>
        );
      case 'iris':
        return (
          <g>
            {/* Sword-shaped basal fans */}
            <path
              d="M 168 418 Q 138 300, 122 185 Q 152 288, 178 416 Z"
              fill={palette.foliage}
              fillOpacity="0.88"
              stroke="#292524"
              strokeWidth="0.9"
            />
            <path
              d="M 190 418 Q 228 295, 245 198 Q 212 302, 198 416 Z"
              fill={palette.foliage}
              fillOpacity="0.82"
              stroke="#292524"
              strokeWidth="0.9"
            />
            <path
              d="M 180 418 L 180 185"
              fill="none"
              stroke={palette.foliage}
              strokeWidth="3.6"
              strokeLinecap="round"
            />
          </g>
        );
      case 'lotus':
        return (
          <g>
            {/* Graceful water-surface lily pad */}
            <ellipse
              cx="180"
              cy="345"
              rx="105"
              ry="26"
              fill={palette.foliage}
              fillOpacity="0.82"
              stroke="#292524"
              strokeWidth="0.9"
            />
            <path
              d="M 180 345 L 250 330 M 180 345 L 118 332 M 180 345 L 145 362 M 180 345 L 222 361"
              stroke="#FBF9F5"
              strokeOpacity="0.35"
              strokeWidth="0.8"
            />
            <path
              d="M 180 416 Q 174 300, 180 198"
              fill="none"
              stroke={palette.foliage}
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        );
      case 'lavender':
        return (
          <g>
            {/* Three delicate upright stems */}
            <path d="M 180 416 Q 178 300, 180 120" fill="none" stroke={palette.foliage} strokeWidth="2.4" />
            <path d="M 176 416 Q 152 315, 134 162" fill="none" stroke={palette.foliage} strokeWidth="1.9" />
            <path d="M 184 416 Q 208 320, 224 156" fill="none" stroke={palette.foliage} strokeWidth="1.9" />
            {/* Narrow silver-green opposite leaves */}
            {[330, 355, 375].map((y, idx) => (
              <g key={idx}>
                <path
                  d={`M 178 ${y} Q 146 ${y - 16}, 136 ${y - 34} Q 154 ${y - 18}, 178 ${y - 4} Z`}
                  fill={palette.foliage}
                  fillOpacity="0.88"
                  stroke="#292524"
                  strokeWidth="0.7"
                />
                <path
                  d={`M 182 ${y - 8} Q 214 ${y - 24}, 224 ${y - 42} Q 206 ${y - 26}, 182 ${y - 12} Z`}
                  fill={palette.foliage}
                  fillOpacity="0.85"
                  stroke="#292524"
                  strokeWidth="0.7"
                />
              </g>
            ))}
          </g>
        );
      default:
        return (
          <g>
            {/* Classic botanical curved stem */}
            <path
              d="M 176 418 C 174 345, 188 282, 180 194"
              fill="none"
              stroke={palette.foliage}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Secondary lateral stem with unopened bud */}
            <path
              d="M 180 315 C 208 292, 232 252, 242 214"
              fill="none"
              stroke={palette.foliage}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Unopened botanical bud */}
            <g transform="translate(244, 206) rotate(22)">
              <path
                d="M 0 12 C -8 4, -8 -10, 0 -18 C 8 -10, 8 4, 0 12 Z"
                fill={palette.primary}
                stroke="#292524"
                strokeWidth="0.9"
              />
              <path
                d="M -6 8 C -9 14, -2 18, 0 18 C 2 18, 9 14, 6 8 C 3 12, -3 12, -6 8 Z"
                fill={palette.foliage}
                stroke="#292524"
                strokeWidth="0.8"
              />
            </g>
            {/* Left primary veined leaf */}
            <g transform="translate(178, 326) rotate(-42)">
              <path
                d="M 0 0 C -24 -18, -28 -58, 0 -86 C 28 -58, 24 -18, 0 0 Z"
                fill={palette.foliage}
                fillOpacity="0.92"
                stroke="#292524"
                strokeWidth="0.95"
              />
              <path d="M 0 -2 L 0 -82" stroke="#FBF9F5" strokeOpacity="0.4" strokeWidth="0.8" />
              <path d="M 0 -24 L -13 -38 M 0 -42 L -14 -56 M 0 -28 L 13 -42 M 0 -48 L 12 -62" stroke="#FBF9F5" strokeOpacity="0.3" strokeWidth="0.65" />
            </g>
            {/* Right lower leaf */}
            <g transform="translate(179, 368) rotate(48)">
              <path
                d="M 0 0 C -20 -16, -24 -48, 0 -72 C 24 -48, 20 -16, 0 0 Z"
                fill={palette.foliage}
                fillOpacity="0.84"
                stroke="#292524"
                strokeWidth="0.95"
              />
              <path d="M 0 -2 L 0 -68" stroke="#FBF9F5" strokeOpacity="0.4" strokeWidth="0.75" />
              <path d="M 0 -22 L -10 -34 M 0 -38 L -11 -50 M 0 -24 L 10 -36" stroke="#FBF9F5" strokeOpacity="0.3" strokeWidth="0.6" />
            </g>
          </g>
        );
    }
  };

  const renderBlossom = () => {
    switch (archetype) {
      case 'camellia':
      case 'peony':
      case 'rose': {
        const outerCount = archetype === 'peony' ? 10 : 8;
        const midCount = archetype === 'rose' ? 7 : 8;
        const innerCount = 6;
        return (
          <g transform="translate(180, 170)">
            {/* Outer whorl */}
            {Array.from({ length: outerCount }).map((_, i) => {
              const angle = (360 / outerCount) * i;
              return (
                <path
                  key={`o-${i}`}
                  transform={`rotate(${angle})`}
                  d="M 0 0 C -30 -24, -36 -74, 0 -86 C 36 -74, 30 -24, 0 0 Z"
                  fill={`url(#petal-grad-${uid})`}
                  stroke="#292524"
                  strokeWidth="0.85"
                />
              );
            })}
            {/* Middle whorl */}
            {Array.from({ length: midCount }).map((_, i) => {
              const angle = (360 / midCount) * i + 22;
              return (
                <path
                  key={`m-${i}`}
                  transform={`rotate(${angle})`}
                  d="M 0 0 C -24 -18, -28 -56, 0 -64 C 28 -56, 24 -18, 0 0 Z"
                  fill={`url(#petal-inner-${uid})`}
                  stroke="#292524"
                  strokeWidth="0.8"
                />
              );
            })}
            {/* Inner whorl */}
            {Array.from({ length: innerCount }).map((_, i) => {
              const angle = (360 / innerCount) * i + 10;
              return (
                <path
                  key={`i-${i}`}
                  transform={`rotate(${angle})`}
                  d="M 0 0 C -16 -12, -18 -38, 0 -44 C 18 -38, 16 -12, 0 0 Z"
                  fill={palette.primary}
                  fillOpacity="0.92"
                  stroke="#292524"
                  strokeWidth="0.75"
                />
              );
            })}
            {/* Golden stamen crown */}
            <circle cx="0" cy="0" r="11" fill={palette.center} fillOpacity="0.3" />
            {Array.from({ length: 14 }).map((_, i) => {
              const rad = ((360 / 14) * i * Math.PI) / 180;
              const x = Math.cos(rad) * 12;
              const y = Math.sin(rad) * 12;
              return (
                <g key={`st-${i}`}>
                  <line x1="0" y1="0" x2={x} y2={y} stroke="#44403C" strokeWidth="0.6" />
                  <circle cx={x} cy={y} r="2.1" fill={palette.center} stroke="#292524" strokeWidth="0.4" />
                </g>
              );
            })}
          </g>
        );
      }

      case 'chrysanthemum':
      case 'marigold': {
        const outerRays = 24;
        const innerRays = 16;
        return (
          <g transform="translate(180, 168)">
            {Array.from({ length: outerRays }).map((_, i) => {
              const angle = (360 / outerRays) * i;
              return (
                <path
                  key={`cr-o-${i}`}
                  transform={`rotate(${angle})`}
                  d="M 0 0 C -9 -26, -12 -74, 0 -90 C 12 -74, 9 -26, 0 0 Z"
                  fill={`url(#petal-grad-${uid})`}
                  stroke="#292524"
                  strokeWidth="0.7"
                />
              );
            })}
            {Array.from({ length: innerRays }).map((_, i) => {
              const angle = (360 / innerRays) * i + 11;
              return (
                <path
                  key={`cr-m-${i}`}
                  transform={`rotate(${angle})`}
                  d="M 0 0 C -8 -18, -10 -52, 0 -64 C 10 -52, 8 -18, 0 0 Z"
                  fill={`url(#petal-inner-${uid})`}
                  stroke="#292524"
                  strokeWidth="0.7"
                />
              );
            })}
            <circle cx="0" cy="0" r="18" fill={palette.center} stroke="#292524" strokeWidth="0.85" />
            {Array.from({ length: 18 }).map((_, i) => {
              const rad = (i * 137.5 * Math.PI) / 180;
              const dist = 3 + Math.sqrt(i) * 3;
              return (
                <circle
                  key={`seed-${i}`}
                  cx={Math.cos(rad) * dist}
                  cy={Math.sin(rad) * dist}
                  r="1.4"
                  fill={palette.secondary}
                />
              );
            })}
          </g>
        );
      }

      case 'iris':
        return (
          <g transform="translate(180, 165)">
            {/* Upright three standards */}
            <path
              d="M 0 10 C -22 -18, -28 -68, 0 -86 C 28 -68, 22 -18, 0 10 Z"
              fill={`url(#petal-inner-${uid})`}
              stroke="#292524"
              strokeWidth="0.9"
            />
            <path
              d="M -6 14 C -42 -6, -54 -48, -32 -70 C -10 -58, -8 -16, -6 14 Z"
              fill={`url(#petal-grad-${uid})`}
              stroke="#292524"
              strokeWidth="0.9"
            />
            <path
              d="M 6 14 C 42 -6, 54 -48, 32 -70 C 10 -58, 8 -16, 6 14 Z"
              fill={`url(#petal-grad-${uid})`}
              stroke="#292524"
              strokeWidth="0.9"
            />
            {/* Three drooping velvet falls */}
            <path
              d="M -10 12 C -54 16, -74 52, -48 76 C -22 86, -8 42, -10 12 Z"
              fill={palette.primary}
              stroke="#292524"
              strokeWidth="0.95"
            />
            <path
              d="M 10 12 C 54 16, 74 52, 48 76 C 22 86, 8 42, 10 12 Z"
              fill={palette.primary}
              stroke="#292524"
              strokeWidth="0.95"
            />
            <path
              d="M 0 16 C -24 38, -26 84, 0 98 C 26 84, 24 38, 0 16 Z"
              fill={palette.primary}
              stroke="#292524"
              strokeWidth="0.95"
            />
            {/* Golden beard crest */}
            <ellipse cx="0" cy="40" rx="5.5" ry="15" fill={palette.center} stroke="#292524" strokeWidth="0.6" />
          </g>
        );

      case 'hellebore':
      case 'snowdrop':
      case 'bluebell': {
        const isHangingArch = archetype === 'snowdrop' || archetype === 'bluebell';
        return (
          <g transform={isHangingArch ? 'translate(256, 152) rotate(12)' : 'translate(180, 178) rotate(14)'}>
            {/* Bell / nodding cup */}
            {archetype === 'bluebell' ? (
              <g>
                {[0, 1, 2].map((idx) => (
                  <g key={idx} transform={`translate(${idx * -26}, ${idx * 34}) rotate(${idx * -10})`}>
                    <path
                      d="M 0 0 C -14 14, -18 32, -22 44 C -10 40, -4 42, 0 46 C 4 42, 10 40, 22 44 C 18 32, 14 14, 0 0 Z"
                      fill={`url(#petal-grad-${uid})`}
                      stroke="#292524"
                      strokeWidth="0.9"
                    />
                  </g>
                ))}
              </g>
            ) : (
              <g>
                <path
                  d="M 0 -10 C -34 10, -46 58, -26 78 C -10 64, 10 64, 26 78 C 46 58, 34 10, 0 -10 Z"
                  fill={`url(#petal-grad-${uid})`}
                  stroke="#292524"
                  strokeWidth="0.95"
                />
                <path
                  d="M 0 -6 C -18 14, -24 46, -12 64 C -4 54, 4 54, 12 64 C 24 46, 18 14, 0 -6 Z"
                  fill={palette.secondary}
                  fillOpacity="0.9"
                  stroke="#292524"
                  strokeWidth="0.8"
                />
                <circle cx="0" cy="48" r="5" fill={palette.center} stroke="#292524" strokeWidth="0.6" />
              </g>
            )}
          </g>
        );
      }

      case 'lotus':
        return (
          <g transform="translate(180, 178)">
            {[-48, -26, 0, 26, 48].map((rot, idx) => (
              <path
                key={`lotus-o-${idx}`}
                transform={`rotate(${rot})`}
                d="M 0 18 C -22 -12, -20 -66, 0 -88 C 20 -66, 22 -12, 0 18 Z"
                fill={`url(#petal-grad-${uid})`}
                stroke="#292524"
                strokeWidth="0.9"
              />
            ))}
            {[-18, 0, 18].map((rot, idx) => (
              <path
                key={`lotus-i-${idx}`}
                transform={`rotate(${rot})`}
                d="M 0 14 C -16 -10, -14 -52, 0 -70 C 14 -52, 16 -10, 0 14 Z"
                fill={`url(#petal-inner-${uid})`}
                stroke="#292524"
                strokeWidth="0.85"
              />
            ))}
            <ellipse cx="0" cy="-16" rx="14" ry="8" fill={palette.center} stroke="#292524" strokeWidth="0.8" />
          </g>
        );

      case 'lavender':
        return (
          <g>
            {[
              { x: 180, y: 120, scale: 1 },
              { x: 134, y: 162, scale: 0.88 },
              { x: 224, y: 156, scale: 0.9 },
            ].map((spire, sIdx) => (
              <g key={sIdx} transform={`translate(${spire.x}, ${spire.y}) scale(${spire.scale})`}>
                {Array.from({ length: 12 }).map((_, i) => {
                  const yOff = i * 10;
                  const side = i % 2 === 0 ? -1 : 1;
                  return (
                    <ellipse
                      key={i}
                      cx={side * 5.5}
                      cy={yOff}
                      rx="6.2"
                      ry="4.3"
                      transform={`rotate(${side * -20}, ${side * 5.5}, ${yOff})`}
                      fill={i % 3 === 0 ? palette.secondary : palette.primary}
                      stroke="#292524"
                      strokeWidth="0.65"
                    />
                  );
                })}
              </g>
            ))}
          </g>
        );

      case 'wisteria':
        return (
          <g>
            {[
              { x: 125, y: 78, rows: 9 },
              { x: 188, y: 82, rows: 11 },
              { x: 256, y: 86, rows: 8 },
            ].map((cluster, cIdx) => (
              <g key={cIdx} transform={`translate(${cluster.x}, ${cluster.y})`}>
                <line x1="0" y1="0" x2="0" y2={cluster.rows * 17} stroke={palette.foliage} strokeWidth="1.5" />
                {Array.from({ length: cluster.rows }).map((_, rIdx) => {
                  const shrink = 1 - rIdx / (cluster.rows + 2);
                  const y = rIdx * 16 + 10;
                  return (
                    <g key={rIdx} transform={`translate(0, ${y}) scale(${shrink})`}>
                      <ellipse cx="-8" cy="0" rx="10" ry="7" fill={palette.primary} stroke="#292524" strokeWidth="0.65" />
                      <ellipse cx="8" cy="2" rx="10" ry="7" fill={palette.secondary} stroke="#292524" strokeWidth="0.65" />
                      <circle cx="0" cy="4" r="3" fill={palette.center} />
                    </g>
                  );
                })}
              </g>
            ))}
          </g>
        );

      default:
        // Poppy, Narcissus, Violet, Lily — 5-6 distinct sweeping petals
        return (
          <g transform="translate(180, 174)">
            {Array.from({ length: archetype === 'narcissus' || archetype === 'lily' ? 6 : 5 }).map((_, i, arr) => {
              const angle = (360 / arr.length) * i;
              const widthFactor = archetype === 'poppy' ? 42 : archetype === 'lily' ? 22 : 30;
              return (
                <path
                  key={i}
                  transform={`rotate(${angle})`}
                  d={`M 0 0 C -${widthFactor} -24, -${widthFactor * 0.9} -74, 0 -86 C ${widthFactor * 0.9} -74, ${widthFactor} -24, 0 0 Z`}
                  fill={`url(#petal-grad-${uid})`}
                  stroke="#292524"
                  strokeWidth="0.9"
                />
              );
            })}
            {/* Delicate radial veins */}
            {Array.from({ length: archetype === 'narcissus' || archetype === 'lily' ? 6 : 5 }).map((_, i, arr) => {
              const angle = (360 / arr.length) * i;
              return (
                <line
                  key={`v-${i}`}
                  transform={`rotate(${angle})`}
                  x1="0"
                  y1="-14"
                  x2="0"
                  y2="-66"
                  stroke="#292524"
                  strokeOpacity="0.22"
                  strokeWidth="0.7"
                />
              );
            })}
            {/* Corona / Velvet center */}
            <circle cx="0" cy="0" r="14" fill={palette.center} stroke="#292524" strokeWidth="0.9" />
            <circle cx="0" cy="0" r="6" fill={palette.secondary} fillOpacity="0.55" />
          </g>
        );
    }
  };

  const isCompact = variant === 'card';

  return (
    <div
      className={`relative overflow-hidden bg-[#F4EFE6] border border-[#D8D0C2] ${
        isCompact ? 'aspect-[4/3]' : 'aspect-[3/4]'
      } ${className}`}
    >
      {/* Subtle archival border rule inside plate */}
      {!isCompact && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 border border-[#D8D0C2]/80"
        />
      )}

      {/* Top plate metadata (hero & modal only) */}
      {!isCompact && (
        <div className="pointer-events-none absolute top-5 left-6 right-6 flex items-center justify-between text-[11px] tracking-[0.14em] uppercase text-[#6B645B] tabular-nums">
          <span>{plateNumber}</span>
          <span>{accessionCode}</span>
        </div>
      )}

      <svg
        viewBox="0 0 360 460"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
        role="img"
        aria-label={`Botanical plate illustration of ${flower.commonName} (${latinName})`}
      >
        <defs>
          <radialGradient id={`wash-${uid}`} cx="50%" cy="42%" r="45%">
            <stop offset="0%" stopColor={palette.wash} stopOpacity="0.9" />
            <stop offset="70%" stopColor={palette.wash} stopOpacity="0.35" />
            <stop offset="100%" stopColor="#F4EFE6" stopOpacity="0" />
          </radialGradient>

          <linearGradient id={`petal-grad-${uid}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={palette.primary} />
            <stop offset="65%" stopColor={palette.secondary} />
            <stop offset="100%" stopColor={palette.secondary} stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id={`petal-inner-${uid}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={palette.primary} />
            <stop offset="100%" stopColor={palette.secondary} />
          </linearGradient>
        </defs>

        {/* Botanical watercolor wash behind specimen */}
        <circle cx="180" cy="196" r="145" fill={`url(#wash-${uid})`} />

        {/* Subtle botanical crosshair guide lines */}
        {!isCompact && (
          <g stroke="#CFC6B6" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.55">
            <line x1="180" y1="45" x2="180" y2="415" />
            <line x1="45" y1="196" x2="315" y2="196" />
          </g>
        )}

        {renderFoliageAndStem()}
        {renderBlossom()}

        {/* Botanical Latin inscription & 10mm scale bar inside hero plate */}
        {!isCompact && (
          <g>
            <line x1="56" y1="428" x2="104" y2="428" stroke="#6B645B" strokeWidth="0.9" />
            <line x1="56" y1="424" x2="56" y2="432" stroke="#6B645B" strokeWidth="0.9" />
            <line x1="104" y1="424" x2="104" y2="432" stroke="#6B645B" strokeWidth="0.9" />
            <text
              x="80"
              y="442"
              textAnchor="middle"
              fill="#6B645B"
              fontSize="9"
              fontFamily="DM Sans, sans-serif"
              letterSpacing="1.2"
            >
              10 MM
            </text>
            <text
              x="304"
              y="438"
              textAnchor="end"
              fill="#44403C"
              fontSize="12"
              fontStyle="italic"
              fontFamily="Cormorant Garamond, Georgia, serif"
            >
              {latinName}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
