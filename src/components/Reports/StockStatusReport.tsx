import { TaskType } from '@prisma/client';

import useReport from '@/hooks/useReport';

import Chart from '../Chart';
import Spinner from '../Spinner';

export default function StockStatusReport() {
  const { data, isLoading } = useReport(TaskType.STOCK_STATUS);

  if (isLoading) {
    return <Spinner />;
  }

  return <Chart type="line" data={data.data || []} />;
}
