import React, { useId } from 'react';

/**
 * Extruded bubble wordmark inspired by myscribble.in.
 * Renders crisp multi-layer SVG typography with thick stroke,
 * hard 3D offset extrusion, and optional hover prism shimmer.
 */
export const ScribbleWordmark = ({
  text = "chulbul's",
  subtitle,
  variant = 'white', // 'white' | 'pink' | 'dark'
  size = 'md', // 'xs' | 'sm' | 'md' | 'lg' | 'hero' | 'footer'
  shimmer = true,
  className = '',
}) => {
  const uid = useId().replace(/:/g, '');

  const sizeConfig = {
    xs: 'h-6 w-auto',
    sm: 'h-7 w-auto',
    md: 'h-8 w-auto',
    lg: 'h-11 w-auto',
    hero: 'w-[280px] sm:w-[400px] md:w-[500px] h-auto',
    footer: 'h-7 sm:h-9 w-auto',
  };

  const palette = {
    white: {
      fill: '#ffffff',
      stroke: '#111111',
      extrude: '#111111',
      accent: '#ff0457',
    },
    pink: {
      fill: '#ff0449',
      stroke: '#ff0449',
      extrude: '#99002a',
      accent: '#ff8cb3',
    },
    dark: {
      fill: '#111827',
      stroke: '#111827',
      extrude: '#ff0457',
      accent: '#ff0457',
    },
  };

  const colors = palette[variant] || palette.white;
  const charCount = Math.max(text.length, 6);
  const viewWidth = Math.round(charCount * 28 + 36);
  const viewHeight = subtitle ? 86 : 68;
  const isCleanPink = variant === 'pink';

  return (
    <span
      className={`group/wm relative inline-flex items-center select-none ${className}`}
      aria-label={subtitle ? `${text} ${subtitle}` : text}
    >
      <svg
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        className={`overflow-visible transition-transform duration-300 ease-out group-hover/wm:scale-[1.03] ${sizeConfig[size] || sizeConfig.md}`}
        role="img"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`wm-prism-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.fill} stopOpacity="0" />
            <stop offset="35%" stopColor="#ffd6e6" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#fff7ae" stopOpacity="0.95" />
            <stop offset="65%" stopColor="#c7f2ff" stopOpacity="0.95" />
            <stop offset="100%" stopColor={colors.fill} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Hard 3D Extrusion Shadow Layer */}
        {!isCleanPink && (
          <text
            x="50%"
            y={subtitle ? '46' : '49'}
            textAnchor="middle"
            fill={colors.extrude}
            stroke={colors.extrude}
            strokeWidth="7.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            transform="translate(2.5, 4)"
            style={{
              fontFamily: "'Caveat', 'Outfit', cursive, sans-serif",
              fontWeight: 700,
              fontSize: '46px',
              letterSpacing: '-0.02em',
            }}
          >
            {text}
          </text>
        )}

        {/* Main Stroke + Fill Text */}
        <text
          x="50%"
          y={subtitle ? '46' : '49'}
          textAnchor="middle"
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth={isCleanPink ? '1.2' : '7'}
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{
            paintOrder: 'stroke fill',
            fontFamily: "'Caveat', 'Outfit', cursive, sans-serif",
            fontWeight: 700,
            fontSize: '46px',
            letterSpacing: '-0.02em',
          }}
        >
          {text}
        </text>

        {/* Hover Holographic Glint Layer */}
        {shimmer && !isCleanPink && (
          <text
            x="50%"
            y={subtitle ? '46' : '49'}
            textAnchor="middle"
            fill={`url(#wm-prism-${uid})`}
            className="opacity-0 transition-opacity duration-300 group-hover/wm:opacity-80 pointer-events-none"
            style={{
              fontFamily: "'Caveat', 'Outfit', cursive, sans-serif",
              fontWeight: 700,
              fontSize: '46px',
              letterSpacing: '-0.02em',
            }}
          >
            {text}
          </text>
        )}

        {/* Optional Tiny Art Subtitle */}
        {subtitle && (
          <text
            x="50%"
            y="72"
            textAnchor="middle"
            fill={isCleanPink ? '#ff0449' : '#6e6e73'}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: '11px',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
            }}
          >
            {subtitle}
          </text>
        )}
      </svg>
    </span>
  );
};

export default ScribbleWordmark;
