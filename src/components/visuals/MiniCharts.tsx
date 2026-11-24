import React from 'react';

interface LineSeriesPoint {
  label: string;
  value: number;
}

interface SimpleAreaChartProps {
  data: LineSeriesPoint[];
  color: string;
  height?: number;
  formatValue?: (val: number) => string;
}

export const SimpleAreaChart: React.FC<SimpleAreaChartProps> = ({
  data,
  color,
  height = 180,
  formatValue = (v) => String(v),
}) => {
  const uid = React.useId().replace(/:/g, '');
  if (data.length === 0) {
    return (
      <div style={{ height }} className="flex items-center justify-center text-xs text-slate-500">
        Sem dados registrados ainda.
      </div>
    );
  }

  const width = 620;
  const padL = 68;
  const padR = 16;
  const padT = 16;
  const padB = 28;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;

  const vals = data.map((d) => d.value);
  const rawMin = Math.min(...vals);
  const rawMax = Math.max(...vals);
  const span = Math.max(1, rawMax - rawMin);
  const minVal = rawMin - span * 0.1;
  const maxVal = rawMax + span * 0.1;

  const coords = data.map((d, i) => {
    const x = data.length === 1 ? padL + innerW / 2 : padL + (i / (data.length - 1)) * innerW;
    const y = padT + innerH - ((d.value - minVal) / (maxVal - minVal)) * innerH;
    return { x, y, ...d };
  });

  const linePath = coords.map((c, idx) => `${idx === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');
  const areaPath =
    coords.length > 1
      ? `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${padT + innerH} L ${coords[0].x.toFixed(1)} ${padT + innerH} Z`
      : '';

  const yTicks = [minVal, (minVal + maxVal) / 2, maxVal];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <defs>
        <linearGradient id={`area_${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {yTicks.map((tick, idx) => {
        const y = padT + innerH - ((tick - minVal) / (maxVal - minVal)) * innerH;
        return (
          <g key={idx}>
            <line x1={padL} y1={y} x2={width - padR} y2={y} stroke="rgba(255,255,255,0.07)" strokeDasharray="3 3" />
            <text
              x={padL - 8}
              y={y + 4}
              textAnchor="end"
              fill="#64748B"
              fontSize="10"
              fontFamily="JetBrains Mono, monospace"
            >
              {formatValue(tick)}
            </text>
          </g>
        );
      })}

      {areaPath && <path d={areaPath} fill={`url(#area_${uid})`} />}
      {coords.length > 1 && (
        <path d={linePath} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      )}

      {coords.map((c, idx) => (
        <g key={idx}>
          <circle cx={c.x} cy={c.y} r={coords.length > 14 ? 2.5 : 3.5} fill={color} />
          {(idx === 0 || idx === coords.length - 1 || idx % Math.max(1, Math.floor(coords.length / 6)) === 0) && (
            <text
              x={c.x}
              y={height - 6}
              textAnchor="middle"
              fill="#64748B"
              fontSize="10"
              fontFamily="JetBrains Mono, monospace"
            >
              {c.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
};
