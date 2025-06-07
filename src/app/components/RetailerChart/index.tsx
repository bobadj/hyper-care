import { toSnakeCase } from '@/app/utils';
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
} from 'recharts';

type RetailerChartData = {
  name: string;
  customer: Array<{ name: string; value: number }>;
};

type RetailerChartProps = {
  data: RetailerChartData[];
  title?: string;
  barColor?: `#${string}`;
};

export default function RetailerChart({
  title = 'Customers - Sell In',
  data,
  barColor = '#06524c',
}: RetailerChartProps) {
  const chartData = data.map((item) => {
    const obj = { name: item.name };
    const customers = (item.customer || []).reduce(
      (arr, c) => ({ ...arr, [toSnakeCase(c.name)]: c.value }),
      {},
    );
    return {
      name: obj.name,
      ...customers,
    };
  });
  const customers = Array.from(
    new Set(data.flatMap((d) => d.customer.map((c) => c.name))),
  );

  return (
    <div className="bg-white px-4 py-2 shadow-xs">
      <h2 className="text-center font-bold mb-4 text-neutral-500 mb-5">
        {title}
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} barSize={30}>
          <CartesianGrid strokeDashoffset={3} />
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
            <Bar dataKey={toSnakeCase(customer)} key={i} fill={barColor} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
