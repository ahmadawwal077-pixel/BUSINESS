import React from 'react';

const Logo = ({
  width = 220,
  height = 52,
  className = '',
  style = {},
  title = 'POSITIVEHILLS',
  primary = 'var(--brand, #0ea5a4)',
  accent = 'var(--accent, #2b8aef)',
  compact = false,
}) => {
  const combinedStyle = { display: 'block', width, height, ...style };

  // Compact version shows only the icon (useful for mobile/nav)
  if (compact) {
    return (
      <svg
        role="img"
        aria-label={title}
        className={className}
        style={{ width: Math.min(width, 56), height: Math.min(height, 56), ...style }}
        viewBox="0 0 80 80"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="phG2" x1="0" x2="1">
            <stop offset="0%" stopColor={primary} />
            <stop offset="100%" stopColor={accent} />
          </linearGradient>
        </defs>
        <rect width="80" height="80" rx="16" fill="url(#phG2)" opacity="0.06" />
        <g transform="translate(8,8)">
          <path d="M0 48 C24 8, 56 8, 72 48 L0 48 Z" fill="url(#phG2)" />
          <circle cx="52" cy="20" r="8" fill="#ffd166" opacity="0.95" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      role="img"
      aria-label={title}
      className={className}
      style={combinedStyle}
      viewBox="0 0 420 96"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMinYMid meet"
    >
      <title>{title}</title>
      <defs>
        <linearGradient id="phGradWide" x1="0" x2="1">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={accent} />
        </linearGradient>
        <radialGradient id="sunGlow2" cx="50%" cy="40%" r="40%">
          <stop offset="0%" stopColor="#fff7d6" stopOpacity="1" />
          <stop offset="100%" stopColor="#ffd166" stopOpacity="0.25" />
        </radialGradient>
        <filter id="soft2" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Icon */}
      <g transform="translate(12,12)">
        <circle cx="60" cy="20" r="10" fill="url(#sunGlow2)" />
        <g filter="url(#soft2)">
          <path d="M0 56 C30 14, 120 12, 160 56 L0 56 Z" fill="url(#phGradWide)" />
          <path d="M88 56 C120 34, 156 34, 208 56 L88 56 Z" fill="rgba(255,255,255,0.06)" />
        </g>
      </g>

      {/* Wordmark */}
      <g transform="translate(180,66)">
        <text
          x="0"
          y="-6"
          fontFamily="Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
          fontSize="30"
          fontWeight="700"
          fill="var(--text, #0f172a)"
          style={{ letterSpacing: '-0.01em' }}
        >
          <tspan style={{ fill: 'var(--text, #0f172a)' }}>POSITIVE</tspan>
          <tspan style={{ fill: accent, fontWeight: 800, marginLeft: '6px' }}>HILLS</tspan>
        </text>
      </g>

      {/* Subtle tagline for larger widths (hidden via CSS where needed) */}
      <g transform="translate(180,86)">
        <text x="0" y="0" fontSize="10" fill="#6b7280">Insights • Strategy • Growth</text>
      </g>
    </svg>
  );
};

export default Logo;
