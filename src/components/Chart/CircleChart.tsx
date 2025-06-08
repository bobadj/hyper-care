'use client';

import { useRef } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  PieLabelRenderProps,
} from 'recharts';

import Dropdown from '../Dropdown';
import MaterialIcon from '../MaterialIcon';

import type { ColorType } from '@/types';
import { useExport } from '@/hooks/useHook';
import { generateMonochromeRamp } from '@/utils';

type CircleChartProps = {
  title?: string;
  data: { name: string; value: number }[];
  topN?: number;
  topColors?: ColorType[];
};

const renderCustomizedLabel = ({
  x,
  y,
  cx,
  cy,
  name,
  value,
}: PieLabelRenderProps) => {
  return (
    <text
      x={x}
      y={y}
      cx={cx}
      cy={cy}
      fill="#000"
      textAnchor={Number(x) > Number(cx) ? 'start' : 'end'}
      dominantBaseline="central"
      style={{ fontSize: 10 }}
    >
      {name}: {value}%
    </text>
  );
};

export default function CircleChart({
  title,
  data = [],
  topN = 4,
  topColors = ['#008d82', '#008d82', '#006a62', '#074a45'],
}: CircleChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const { exportElement, exportCsv } = useExport();

  const monochromeRamps = generateMonochromeRamp(data.length - topN);
  const colors = data.map((_, i) =>
    i < topN ? topColors[i] : monochromeRamps[i - topN],
  );

  return (
    <div className="w-full h-[500px] bg-white px-5 py-2 shadow-xs">
      <div className="flex flex-row w-full">
        {title && (
          <h2 className="mx-auto font-semibold mb-4 text-neutral-500">
            {title}
          </h2>
        )}
        {data.length > 0 && (
          <Dropdown trigger={<MaterialIcon name="menu" />}>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              <li
                className="p-2 cursor-pointer"
                onClick={() =>
                  exportElement(chartRef.current, {
                    type: 'png',
                    filename: `${title}.pptx`,
                  })
                }
              >
                Export as PPT
              </li>
              <li
                className="p-2 cursor-pointer"
                onClick={() =>
                  exportElement(chartRef.current, {
                    type: 'png',
                    filename: `${title}.png`,
                  })
                }
              >
                Export as PNG
              </li>
              <li
                className="p-2 cursor-pointer"
                onClick={() => exportCsv({ data, filename: `${title}.csv` })}
              >
                Export as CSV
              </li>
            </ul>
          </Dropdown>
        )}
      </div>
      <ResponsiveContainer ref={chartRef}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            label={renderCustomizedLabel}
          >
            {data.map((_, i) => (
              <Cell key={`cell-${i}`} fill={colors[i]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
