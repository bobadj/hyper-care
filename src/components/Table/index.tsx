import { LineupType } from '@/types';

type TableProps = {
  data: LineupType[];
};

export default function Table({ data }: TableProps) {
  return (
    <div className="w-full bg-white px-5 py-2 shadow-xs py-10">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left py-4 text-sm">Rank</th>
            <th className="text-left py-4 text-sm">Retailer</th>
            <th className="text-left py-4 text-sm">Point of sale</th>
            <th className="text-left py-4 text-sm">Percentage (%)</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ rank, retailer, pointOfSale, percentage }, i) => (
            <tr
              className="border-b border-neutral-200 py-2"
              key={`lineup_item_${i}`}
            >
              <td className="py-3 text-sm text-neutral-500">{rank}</td>
              <td className="py-3 text-sm text-neutral-500">{retailer}</td>
              <td className="py-3 text-sm text-neutral-500">{pointOfSale}</td>
              <td className="py-3 text-sm text-neutral-500">{percentage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
