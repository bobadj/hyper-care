import { TaskType } from '@prisma/client';

import useReport from '@/hooks/useReport';

import Chart from '../Chart';
import Spinner from '../Spinner';
import Accordion from '../Accordion';

export default function BrandShareReport() {
  const { data, isLoading } = useReport(TaskType.BRAND_SHARE);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 pt-4">
      <Chart.Circle data={data.data.sda} title="SDA" />
      <Chart.Circle data={data.data.mda} title="MDA" />
      <div className="col-span-2 bg-white px-4 py-2">
        {(data.data.all || []).map((d: any, i: number) => (
          <Accordion key={`retailer_brand_share-${i}`} title={d.retailer}>
            <Chart.BarInline data={d.data} />
          </Accordion>
        ))}
      </div>
    </div>
  );
}
