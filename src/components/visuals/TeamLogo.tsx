import React, { useState } from 'react';
import { CrestIcon, CrestShape } from '../../types/game';

interface TeamLogoProps {
  teamId?: string;
  isCustom?: boolean;
  customLogoUrl?: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  shape?: CrestShape;
  icon?: CrestIcon;
  size?: number;
  className?: string;
}

const TEAM_LOGO_MAP: Record<string, { src: string; bg: string }> = {
  redbull: { src: '/assets/aistudio/IMG_4723_5c856dc6.png', bg: '#FFFFFF' },
  RBR: { src: '/assets/aistudio/IMG_4723_5c856dc6.png', bg: '#FFFFFF' },

  mclaren: { src: '/assets/aistudio/IMG_4724_5e48ad1a.jpeg', bg: '#FFFFFF' },
  MCL: { src: '/assets/aistudio/IMG_4724_5e48ad1a.jpeg', bg: '#FFFFFF' },

  ferrari: { src: '/assets/aistudio/IMG_4728_6225fdcc.jpeg', bg: '#FFFFFF' },
  FER: { src: '/assets/aistudio/IMG_4728_6225fdcc.jpeg', bg: '#FFFFFF' },

  mercedes: { src: '/assets/aistudio/IMG_4729_8a544887.png', bg: '#000000' },
  MER: { src: '/assets/aistudio/IMG_4729_8a544887.png', bg: '#000000' },

  aston_martin: { src: '/assets/aistudio/IMG_4725_1ee0c982.png', bg: '#FFFFFF' },
  AMR: { src: '/assets/aistudio/IMG_4725_1ee0c982.png', bg: '#FFFFFF' },

  haas: { src: '/assets/aistudio/IMG_4726_48cba75d.png', bg: '#FFFFFF' },
  HAS: { src: '/assets/aistudio/IMG_4726_48cba75d.png', bg: '#FFFFFF' },

  cadillac: { src: '/assets/aistudio/IMG_4727_e0605ad4.png', bg: '#FFFFFF' },
  CAD: { src: '/assets/aistudio/IMG_4727_e0605ad4.png', bg: '#FFFFFF' },

  alpine: { src: '/assets/aistudio/IMG_4730_b0730957.jpeg', bg: '#FFFFFF' },
  ALP: { src: '/assets/aistudio/IMG_4730_b0730957.jpeg', bg: '#FFFFFF' },

  AUD: { src: '/assets/aistudio/IMG_4733_aea23850.jpeg', bg: '#FFFFFF' },
  audi: { src: '/assets/aistudio/IMG_4733_aea23850.jpeg', bg: '#FFFFFF' },

  racing_bulls: { src: '/assets/aistudio/IMG_4732_344a5e60.png', bg: '#FFFFFF' },
  VCB: { src: '/assets/aistudio/IMG_4732_344a5e60.png', bg: '#FFFFFF' },

  williams: { src: '/assets/aistudio/IMG_4731_d409cebd.jpeg', bg: '#FFFFFF' },
  WIL: { src: '/assets/aistudio/IMG_4731_d409cebd.jpeg', bg: '#FFFFFF' },
};

export const TeamLogo: React.FC<TeamLogoProps> = ({
  teamId,
  isCustom = false,
  customLogoUrl,
  shortName,
  primaryColor,
  secondaryColor,
  accentColor,
  shape = 'shield',
  icon = 'wing',
  size = 44,
  className = '',
}) => {
  const uid = React.useId().replace(/:/g, '');
  const [imgError, setImgError] = useState(false);

  React.useEffect(() => {
    setImgError(false);
  }, [customLogoUrl, teamId, shortName]);

  if (customLogoUrl && !imgError) {
    return (
      <div
        style={{
          width: size,
          height: size,
          backgroundColor: '#FFFFFF',
          borderColor: primaryColor,
        }}
        className={`shrink-0 rounded-xl border overflow-hidden flex items-center justify-center p-1 select-none ${className}`}
      >
        <img
          src={customLogoUrl}
          alt={`Logo ${shortName}`}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  const normalizedShort = shortName.slice(0, 3).toUpperCase();
  const mappedLogo = !isCustom
    ? (normalizedShort === 'AUD' ? TEAM_LOGO_MAP.AUD : undefined) ||
      (teamId && teamId !== 'sauber' ? TEAM_LOGO_MAP[teamId] : undefined) ||
      (teamId === 'sauber' && normalizedShort === 'SAU' ? undefined : TEAM_LOGO_MAP[normalizedShort])
    : undefined;

  if (mappedLogo && !imgError) {
    return (
      <div
        style={{
          width: size,
          height: size,
          backgroundColor: mappedLogo.bg,
          borderColor: primaryColor,
        }}
        className={`shrink-0 rounded-xl border overflow-hidden flex items-center justify-center p-1 select-none ${className}`}
      >
        <img
          src={mappedLogo.src}
          alt={`Logo ${shortName}`}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  const renderShapePath = () => {
    switch (shape) {
      case 'hexagon':
        return 'M32 3 L58 18 L58 46 L32 61 L6 46 L6 18 Z';
      case 'diamond':
        return 'M32 3 L60 32 L32 61 L4 32 Z';
      case 'circle':
        return 'M32 4 A28 28 0 1 1 31.99 4 Z';
      case 'wing':
        return 'M6 14 L58 14 L52 46 L32 60 L12 46 Z';
      case 'crest':
        return 'M10 6 L54 6 L58 32 L46 54 L32 60 L18 54 L6 32 Z';
      case 'shield':
      default:
        return 'M10 6 L54 6 L54 34 C54 48 32 59 32 59 C32 59 10 48 10 34 Z';
    }
  };

  const renderIcon = () => {
    switch (icon) {
      case 'bolt':
        return <path d="M35 14 L22 33 H31 L28 48 L42 29 H33 Z" fill={accentColor} opacity="0.9" />;
      case 'crown':
        return <path d="M18 39 L20 22 L27 29 L32 18 L37 29 L44 22 L46 39 Z" fill={accentColor} opacity="0.9" />;
      case 'flame':
        return <path d="M32 13 C38 22 43 27 42 36 C41 42 37 46 32 46 C27 46 23 42 22 36 C21 30 25 25 27 23 C27 27 30 28 31 24 C32 20 31 16 32 13 Z" fill={accentColor} opacity="0.9" />;
      case 'star':
        return <path d="M32 14 L36 25 L48 25 L38 32 L42 44 L32 37 L22 44 L26 32 L16 25 L28 25 Z" fill={accentColor} opacity="0.9" />;
      case 'target':
        return (
          <g stroke={accentColor} strokeWidth="2.5" fill="none" opacity="0.9">
            <circle cx="32" cy="30" r="11" />
            <circle cx="32" cy="30" r="4" fill={accentColor} />
          </g>
        );
      case 'compass':
        return <path d="M32 13 L39 30 L32 47 L25 30 Z" fill={accentColor} opacity="0.9" />;
      case 'apex':
        return <path d="M17 42 L32 15 L47 42 H39 L32 28 L25 42 Z" fill={accentColor} opacity="0.9" />;
      case 'wing':
      default:
        return (
          <path
            d="M15 26 C24 20 38 19 49 21 C42 25 35 27 28 28 C36 29 42 30 46 32 C36 34 25 35 17 34 Z"
            fill={accentColor}
            opacity="0.9"
          />
        );
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`shrink-0 ${className}`}
      aria-label={`Escudo ${shortName}`}
    >
      <defs>
        <linearGradient id={`grad_${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
      </defs>
      <path d={renderShapePath()} fill={`url(#grad_${uid})`} stroke={accentColor} strokeWidth="2.2" />
      <path d={renderShapePath()} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
      <g transform="translate(0,-3)">{renderIcon()}</g>
      <rect x="14" y="40" width="36" height="12" rx="2" fill="rgba(11,14,20,0.85)" />
      <text
        x="32"
        y="49"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="9.5"
        fontWeight="800"
        fontFamily="Outfit, sans-serif"
        letterSpacing="0.8"
      >
        {normalizedShort}
      </text>
    </svg>
  );
};
