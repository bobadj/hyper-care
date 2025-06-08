'use client';

import classNames from 'classnames';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import Info from '../Info';
import MaterialIcon from '../MaterialIcon';

import { ColorType } from '@/types';

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
  return (
    <div className="flex flex-col gap-2">
      <div className="w-full bg-white px-5 py-2 shadow-xs">
        <div className="flex flex-row w-full items-center">
          <h2 className="mx-auto font-semibold mb-4 text-neutral-500">
            {title}
          </h2>
          <h2 className={classNames('font-semibold mb-4 text-neutral-500')}>
            <MaterialIcon name="menu" cursor />
          </h2>
        </div>

        <div className="flex justify-center">
          <ResponsiveContainer width={350} height={320}>
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
