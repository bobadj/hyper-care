'use client';

import classNames from 'classnames';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import MaterialIcon from '../MaterialIcon';
import Info from '../Info';
import { ColorType } from '@/types';
import LineupTable from './Table';

type LineupProps = {
  title: string;
  data: { name: string; value: number }[];
  colors?: ColorType[];
};

const Lineup = ({
  title,
  data,
  colors = ['#006861', '#008c81'],
}: LineupProps) => {
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
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
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
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <Info title={title} content="30 %" />
    </div>
  );
};

Lineup.Table = LineupTable;

export default Lineup;
