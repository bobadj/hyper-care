'use client';

import { useRef } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import Info from '../Info';
import Dropdown from '../Dropdown';
import MaterialIcon from '../MaterialIcon';

import type { ColorType } from '@/types';
import { useExport } from '@/hooks/useHook';

type PieChartProps = {
  title: string;
  data: { retailer: string; value: number }[];
  colors?: ColorType[];
  valueKey?: string;
  value?: number;
};

export default function PieChart({
  title,
  data,
  colors = ['#006861', '#008c81'],
  valueKey = 'lineupSamplePlacementTotal',
  value = 30,
}: PieChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const { exportElement, exportCsv } = useExport();

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full bg-white px-5 py-2 shadow-xs">
        <div className="flex flex-row w-full items-center">
          <h2 className="mx-auto font-semibold mb-4 text-neutral-500">
            {title}
          </h2>
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

        <div className="flex justify-center">
          <ResponsiveContainer ref={chartRef} width={350} height={320}>
            <RechartsPieChart>
              <Pie
                data={data}
                dataKey={valueKey}
                nameKey="retailer"
                outerRadius={100}
                innerRadius={50}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                align="left"
                iconType="circle"
                formatter={(name) => (
                  <span className="text-black text-sm">{name}</span>
                )}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <Info title={title} content={`${value} %`} />
    </div>
  );
}
