'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

import { ColorType } from '@/types';
import { generateMonochromeRamp, toSnakeCase } from '@/utils';

type BrandShareBarChartProps = {
  title?: string;
  data: { name: string; value: number }[];
  topN?: number;
  topColors?: ColorType[];
};

export default function BrandShareBarChart({
  title = 'Bar Chart',
  data,
  topN = 3,
  topColors = ['#008d82', '#006a62', '#074a45'],
}: BrandShareBarChartProps) {
  const formattedData = data.reduce(
    (acc, item) => ({ ...acc, [toSnakeCase(item.name)]: item.value }),
    {},
  );

  const monochromeRamps = generateMonochromeRamp(data.length - topN);
  const colors = data.map((_, i) =>
    i < topN ? topColors[i] : monochromeRamps[i - topN],
  );

  return (
    <ResponsiveContainer width="100%" height={100}>
      <BarChart layout="vertical" data={[formattedData]} barSize={20}>
        <XAxis type="number" hide={true} domain={[0, 100]} />
        <YAxis dataKey={toSnakeCase(title)} type="category" hide={true} />
        <Legend
          verticalAlign="top"
          iconType="circle"
          align="left"
          height={40}
          formatter={(name: string) => (
            <span className="text-black text-xs">{name}</span>
          )}
        />
        {data.map((item, i) => {
          const key = toSnakeCase(item.name);
          return (
            <Bar dataKey={key} stackId="a" fill={colors[i]} name={item.name}>
              <LabelList
                dataKey={key}
                fill={'#fff'}
                formatter={(value: number) => `${value}%`}
                style={{ fontSize: 9, fontWeight: 'bold' }}
              />
            </Bar>
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}
