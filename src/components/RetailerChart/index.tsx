import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from 'recharts';

import { ColorType } from '@/app/types';
import { toSnakeCase } from '@/app/utils';

export type RetailerChartData = {
  name: string;
  retailer: Array<{ name: string; value: number }>;
};

type RetailerChartProps = {
  data: RetailerChartData[];
  title?: string;
  colors?: ColorType[];
  type?: 'bar' | 'line';
};

export default function RetailerChart({
  title = 'Customers - Sell In',
  data,
  colors = ['#008d82', '#006a62', '#074a45'],
  type = 'bar',
}: RetailerChartProps) {
  const chartData = data.map((item) => {
    const obj = { name: item.name };
    const customers = (item.retailer || []).reduce(
      (arr, c) => ({ ...arr, [toSnakeCase(c.name)]: c.value }),
      {},
    );
    return {
      name: obj.name,
      ...customers,
    };
  });
  const customers = Array.from(
    new Set(data.flatMap((d) => d.retailer.map((c) => c.name))),
  );

  return (
    <div className="bg-white px-4 py-4 shadow-xs">
      <h2 className="text-center font-bold mb-4 text-neutral-500 mb-5">
        {title}
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        {type === 'bar' ? (
          <BarChart data={chartData} barSize={15}>
            <CartesianGrid />
            <XAxis dataKey="name" />
            <YAxis />
            <Legend
              iconType="circle"
              formatter={(name: string) => (
                <span className="text-black text-xs capitalize">{name}</span>
              )}
            />
            <Tooltip />
            {(customers || []).map((customer, i) => (
              <Bar dataKey={toSnakeCase(customer)} key={i} fill={colors[i]} />
            ))}
          </BarChart>
        ) : (
          <LineChart data={chartData}>
            <CartesianGrid strokeDashoffset={3} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend
              iconType="circle"
              formatter={(name: string) => (
                <span className="text-black text-xs capitalize">{name}</span>
              )}
            />
            {(customers || []).map((customer, i) => (
              <Line
                key={i}
                type="monotone"
                dataKey={toSnakeCase(customer)}
                stroke={colors[i]}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
