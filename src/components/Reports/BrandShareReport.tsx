import { TaskType } from '@prisma/client';

import useReport from '@/hooks/useReport';

import Spinner from '../Spinner';
import BrandShare from '../BrandShare';
import Accordion from '../Accordion';

const sdaData = [
  { name: 'Philips', value: 11.9 },
  { name: 'Gorenje', value: 17.8 },
  { name: 'Bosch', value: 14.7 },
  { name: 'Other', value: 24.0 },
  { name: 'Tefal', value: 8.8 },
  { name: 'VOX', value: 7.8 },
  { name: 'Beko', value: 4.8 },
  { name: 'Sencor', value: 2.9 },
  { name: 'Rowenta', value: 2.8 },
  { name: 'ECG', value: 2.2 },
  { name: 'Braun', value: 2.1 },
];

const mdaData = [
  { name: 'Gorenje', value: 23.4 },
  { name: 'VOX', value: 21.0 },
  { name: 'Beko', value: 12.7 },
  { name: 'Bosch', value: 9.0 },
  { name: 'Candy', value: 8.5 },
  { name: 'Midea', value: 5.9 },
  { name: 'Whirlpool', value: 4.9 },
  { name: 'Samsung', value: 4.4 },
  { name: 'Haier', value: 3.7 },
  { name: 'Hisense', value: 2.4 },
  { name: 'Other', value: 4.1 },
];

export default function BrandShareReport() {
  const { data, isLoading } = useReport(TaskType.BRAND_SHARE);

  if (isLoading) {
    return <Spinner />;
  }

  console.log(data);

  return (
    <div className="grid grid-cols-2 gap-4 pt-4">
      <BrandShare data={data.data.sda} title="SDA" />
      <BrandShare data={data.data.mda} title="MDA" />
      <div className="col-span-2 bg-white px-4 py-2">
        {(data.data.all || []).map((d: any, i: number) => (
          <Accordion key={`retailer_brand_share-${i}`} title={d.retailer}>
            <BrandShare.Bar data={d.data} />
          </Accordion>
        ))}
        {/* {(data.data.all || []).map((d: any, i: number) => (
          <div key={`retailer_brand_share-${i}`}>
            <p>{d.retailer}</p>
            <BrandShare.Bar data={d.data} />
          </div>
        ))} */}
        {/* <BrandShare.Bar data={sdaData} />
        <BrandShare.Bar data={sdaData} />
        <BrandShare.Bar data={sdaData} />
        <BrandShare.Bar data={sdaData} /> */}
      </div>
    </div>
  );
}
