import React from 'react';
import { LiveryPattern } from '../../types/game';

interface F1CarLiveryProps {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  pattern: LiveryPattern;
  shortName: string;
  carNumber?: number;
  sponsorLabel?: string;
  className?: string;
}

export const F1CarLivery: React.FC<F1CarLiveryProps> = ({
  primaryColor,
  secondaryColor,
  accentColor,
  pattern,
  shortName,
  carNumber = 1,
  sponsorLabel,
  className = '',
}) => {
  const uid = React.useId().replace(/:/g, '');
  const label = (sponsorLabel || shortName).slice(0, 12).toUpperCase();

  return (
    <svg
      viewBox="0 0 640 200"
      className={`w-full h-auto select-none ${className}`}
      aria-label={`Carro de Fórmula 1 ${shortName}`}
    >
      <defs>
        <linearGradient id={`body_${uid}`} x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="65%" stopColor={primaryColor} />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
        <linearGradient id={`carbon_${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E2430" />
          <stop offset="100%" stopColor="#0D1017" />
        </linearGradient>
        <clipPath id={`chassis_clip_${uid}`}>
          <path d="M58 130 L125 114 L205 104 L265 92 L322 72 L378 72 L455 96 L532 104 L558 118 L552 135 L68 138 Z" />
        </clipPath>
      </defs>

      {/* Track shadow */}
      <ellipse cx="320" cy="174" rx="268" ry="11" fill="rgba(0,0,0,0.55)" />

      {/* Rear Wing */}
      <path d="M530 66 L584 62 L588 86 L546 96 Z" fill={secondaryColor} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <path d="M534 69 L583 66 L584 74 L538 77 Z" fill={accentColor} />
      <rect x="540" y="92" width="12" height="36" fill={`url(#carbon_${uid})`} />

      {/* Underfloor & Diffuser */}
      <path d="M88 136 L546 136 L556 144 L95 144 Z" fill={`url(#carbon_${uid})`} />
      <path d="M190 140 L485 140" stroke={accentColor} strokeWidth="2" opacity="0.7" />

      {/* Main Chassis Body */}
      <path
        d="M58 130 L125 114 L205 104 L265 92 L322 72 L378 72 L455 96 L532 104 L558 118 L552 135 L68 138 Z"
        fill={`url(#body_${uid})`}
      />

      {/* Livery Pattern Overlays inside chassis clip */}
      <g clipPath={`url(#chassis_clip_${uid})`}>
        {pattern === 'aero' && (
          <>
            <path d="M250 142 L355 68 L445 68 L340 142 Z" fill={secondaryColor} opacity="0.88" />
            <path d="M332 142 L428 68 L442 68 L346 142 Z" fill={accentColor} />
          </>
        )}
        {pattern === 'classic' && (
          <>
            <rect x="50" y="122" width="520" height="20" fill={secondaryColor} opacity="0.72" />
            <rect x="190" y="108" width="290" height="4.5" fill={accentColor} />
          </>
        )}
        {pattern === 'stealth' && (
          <>
            <path d="M220 70 L560 70 L560 142 L150 142 Z" fill="#101319" opacity="0.75" />
            <path d="M120 120 L550 105 L550 111 L120 126 Z" fill={primaryColor} />
            <path d="M140 129 L550 118 L550 121 L140 132 Z" fill={accentColor} />
          </>
        )}
        {pattern === 'stripe' && (
          <>
            <path d="M60 125 L555 98 L555 112 L60 133 Z" fill={accentColor} opacity="0.92" />
            <path d="M380 70 L560 70 L560 142 L430 142 Z" fill={secondaryColor} opacity="0.85" />
          </>
        )}
        {pattern === 'diagonal' && (
          <>
            <polygon points="290,145 365,65 565,65 565,145" fill={secondaryColor} opacity="0.92" />
            <polygon points="270,145 345,65 365,65 290,145" fill={accentColor} />
          </>
        )}
      </g>

      {/* Shark Fin & Airbox */}
      <path d="M342 74 L358 58 L398 62 L475 94 L390 92 Z" fill={secondaryColor} />
      <path d="M348 68 L368 62 L390 66 L354 74 Z" fill={accentColor} opacity="0.85" />
      <ellipse cx="348" cy="70" rx="5" ry="7" fill="#0B0E14" />

      {/* Halo Cockpit Safety Structure */}
      <path
        d="M250 100 C268 78 308 75 330 88"
        fill="none"
        stroke="#1C212C"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      <path
        d="M252 100 C270 80 306 77 328 89"
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Driver Helmet inside cockpit */}
      <circle cx="304" cy="91" r="10.5" fill={accentColor} />
      <path d="M294 88 H314 V93 H294 Z" fill="#0B0E14" />

      {/* Front Wing */}
      <path d="M32 135 L112 126 L118 141 L30 143 Z" fill={`url(#carbon_${uid})`} />
      <path d="M32 134 L94 128 L96 132 L32 138 Z" fill={accentColor} />

      {/* Suspension arms */}
      <line x1="152" y1="126" x2="178" y2="115" stroke="#2D3545" strokeWidth="3" />
      <line x1="485" y1="126" x2="452" y2="112" stroke="#2D3545" strokeWidth="3" />

      {/* Sponsor & Car Number */}
      <text
        x="398"
        y="120"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="13"
        fontWeight="700"
        fontFamily="Outfit, sans-serif"
        letterSpacing="1.2"
        opacity="0.94"
      >
        {label}
      </text>
      <text
        x="202"
        y="123"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="13"
        fontWeight="800"
        fontFamily="JetBrains Mono, monospace"
      >
        {carNumber}
      </text>

      {/* Front Tyre */}
      <g transform="translate(148, 134)">
        <circle cx="0" cy="0" r="34" fill="#13161C" />
        <circle cx="0" cy="0" r="30.5" fill="none" stroke="#E10600" strokeWidth="2.5" strokeDasharray="34 10" />
        <circle cx="0" cy="0" r="21" fill="#1D222B" stroke="#364155" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="7" fill={accentColor} />
      </g>

      {/* Rear Tyre */}
      <g transform="translate(492, 131)">
        <circle cx="0" cy="0" r="37" fill="#13161C" />
        <circle cx="0" cy="0" r="33" fill="none" stroke="#E10600" strokeWidth="2.8" strokeDasharray="38 11" />
        <circle cx="0" cy="0" r="22.5" fill="#1D222B" stroke="#364155" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="7.5" fill={accentColor} />
      </g>
    </svg>
  );
};
