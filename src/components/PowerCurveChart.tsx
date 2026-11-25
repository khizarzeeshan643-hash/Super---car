import { useState } from 'react';
import { TorquePoint, UnitSystem } from '../types/car';
import { nmToLbFt, psToHp } from '../utils/units';

interface PowerCurveChartProps {
  points: TorquePoint[];
  redlineRpm: number;
  unitSystem: UnitSystem;
  vehicleLabel: string;
}

export function PowerCurveChart({
  points,
  redlineRpm,
  unitSystem,
  vehicleLabel,
}: PowerCurveChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number>(points.length - 2 >= 0 ? points.length - 2 : 0);

  const width = 620;
  const height = 240;
  const padLeft = 48;
  const padRight = 48;
  const padTop = 24;
  const padBottom = 36;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const convertedPoints = points.map((p) => ({
    rpm: p.rpm,
    power: unitSystem === 'metric' ? p.powerPs : psToHp(p.powerPs),
    torque: unitSystem === 'metric' ? p.torqueNm : nmToLbFt(p.torqueNm),
  }));

  const minRpm = convertedPoints[0]?.rpm ?? 1500;
  const maxRpm = Math.max(redlineRpm, convertedPoints[convertedPoints.length - 1]?.rpm ?? 9000);
  const maxPower = Math.max(...convertedPoints.map((p) => p.power)) * 1.1;
  const maxTorque = Math.max(...convertedPoints.map((p) => p.torque)) * 1.1;

  const xForRpm = (rpm: number) =>
    padLeft + ((rpm - minRpm) / Math.max(1, maxRpm - minRpm)) * chartW;
  const yForPower = (power: number) =>
    padTop + chartH - (power / Math.max(1, maxPower)) * chartH;
  const yForTorque = (torque: number) =>
    padTop + chartH - (torque / Math.max(1, maxTorque)) * chartH;

  const powerPath = convertedPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xForRpm(p.rpm).toFixed(1)} ${yForPower(p.power).toFixed(1)}`)
    .join(' ');

  const torquePath = convertedPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xForRpm(p.rpm).toFixed(1)} ${yForTorque(p.torque).toFixed(1)}`)
    .join(' ');

  const activePoint = convertedPoints[hoveredIndex] ?? convertedPoints[0];
  const powerUnit = unitSystem === 'metric' ? 'PS' : 'hp';
  const torqueUnit = unitSystem === 'metric' ? 'Nm' : 'lb-ft';

  return (
    <div className="bg-white border border-[#E5E2DC] rounded-lg p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#EFECE6]">
        <div>
          <h4 className="font-serif text-lg font-semibold text-[#141416]">
            Engine Output &amp; Torque Profile
          </h4>
          <p className="text-xs text-[#666460] mt-0.5">
            {vehicleLabel} · Redline {redlineRpm.toLocaleString()} rpm
          </p>
        </div>

        {activePoint && (
          <div className="flex items-center gap-5 font-mono text-xs tabular-nums">
            <div>
              <span className="text-[#666460] block">Engine Speed</span>
              <span className="font-semibold text-[#141416]">
                {activePoint.rpm.toLocaleString()} rpm
              </span>
            </div>
            <div>
              <span className="text-[#C81E1E] block">Power</span>
              <span className="font-semibold text-[#141416]">
                {activePoint.power.toLocaleString()} {powerUnit}
              </span>
            </div>
            <div>
              <span className="text-[#403E3A] block">Torque</span>
              <span className="font-semibold text-[#141416]">
                {activePoint.torque.toLocaleString()} {torqueUnit}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[440px]"
          role="img"
          aria-label={`Power and torque curve for ${vehicleLabel}`}
        >
          {/* Horizontal grid lines */}
          {[0.25, 0.5, 0.75, 1].map((fraction) => {
            const y = padTop + chartH * (1 - fraction);
            return (
              <line
                key={fraction}
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="#EFECE6"
                strokeWidth="1"
              />
            );
          })}

          {/* Baseline */}
          <line
            x1={padLeft}
            y1={padTop + chartH}
            x2={width - padRight}
            y2={padTop + chartH}
            stroke="#D5D0C7"
            strokeWidth="1"
          />

          {/* Torque curve (Charcoal Dashed) */}
          <path
            d={torquePath}
            fill="none"
            stroke="#4A4843"
            strokeWidth="2"
            strokeDasharray="5 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Power curve (Cinnabar Crimson Solid) */}
          <path
            d={powerPath}
            fill="none"
            stroke="#C81E1E"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Active vertical scrubber */}
          {activePoint && (
            <line
              x1={xForRpm(activePoint.rpm)}
              y1={padTop}
              x2={xForRpm(activePoint.rpm)}
              y2={padTop + chartH}
              stroke="#D5D0C7"
              strokeWidth="1"
            />
          )}

          {/* Interactive data nodes */}
          {convertedPoints.map((pt, idx) => {
            const cx = xForRpm(pt.rpm);
            const cyPower = yForPower(pt.power);
            const cyTorque = yForTorque(pt.torque);
            const isSelected = idx === hoveredIndex;

            return (
              <g key={pt.rpm}>
                <circle
                  cx={cx}
                  cy={cyTorque}
                  r={isSelected ? 5 : 3}
                  fill="#4A4843"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                <circle
                  cx={cx}
                  cy={cyPower}
                  r={isSelected ? 5.5 : 3.5}
                  fill="#C81E1E"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                {/* X-axis tick label */}
                <text
                  x={cx}
                  y={height - 10}
                  textAnchor="middle"
                  className="fill-[#666460] text-[10px] font-mono"
                >
                  {(pt.rpm / 1000).toFixed(1)}k
                </text>
                {/* Invisible wider hit target for effortless scrubbing */}
                <rect
                  x={cx - 24}
                  y={padTop}
                  width={48}
                  height={chartH + 24}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onClick={() => setHoveredIndex(idx)}
                />
              </g>
            );
          })}

          {/* Y-axis labels */}
          <text
            x={padLeft - 8}
            y={padTop + 6}
            textAnchor="end"
            className="fill-[#C81E1E] text-[10px] font-mono"
          >
            {Math.round(maxPower)}
          </text>
          <text
            x={padLeft - 8}
            y={padTop + chartH}
            textAnchor="end"
            className="fill-[#666460] text-[10px] font-mono"
          >
            0
          </text>
          <text
            x={width - padRight + 8}
            y={padTop + 6}
            textAnchor="start"
            className="fill-[#4A4843] text-[10px] font-mono"
          >
            {Math.round(maxTorque)}
          </text>
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-[#EFECE6] text-xs text-[#666460]">
        <div className="flex items-center gap-5">
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-0.5 bg-[#C81E1E] inline-block" />
            Power ({powerUnit})
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-0.5 border-b-2 border-dashed border-[#4A4843] inline-block" />
            Torque ({torqueUnit})
          </span>
        </div>
        <span>Hover or tap along rpm markers to inspect dyno curve</span>
      </div>
    </div>
  );
}
