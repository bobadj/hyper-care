'use client';

import classNames from 'classnames';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  PieLabelRenderProps,
} from 'recharts';

import MaterialIcon from '../MaterialIcon';
import BrandShareBarChart from './BrandShareBarChart';
import { generateMonochromeRamp } from '@/app/utils';

type BrandShareProps = {
  title?: string;
  data: { name: string; value: number }[];
  topN?: number;
  topColors?: `#${string}`[];
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

const BrandShare = ({
  title,
  data = [],
  topN = 4,
  topColors = ['#008d82', '#008d82', '#006a62', '#074a45'],
}: BrandShareProps) => {
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
        <h2
          className={classNames('font-semibold mb-4 text-neutral-500', {
            'ms-auto': !title,
          })}
        >
          <MaterialIcon name="menu" cursor />
        </h2>
      </div>
      <ResponsiveContainer>
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
};

BrandShare.Bar = BrandShareBarChart;

export default BrandShare;
