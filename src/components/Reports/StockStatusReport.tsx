import { TaskType } from '@prisma/client';

import useReport from '@/hooks/useReport';

import Spinner from '../Spinner';
import RetailerChart from '../RetailerChart';

export default function StockStatusReport() {
  const { data, isLoading } = useReport(TaskType.STOCK_STATUS);

  if (isLoading) {
    return <Spinner />;
  }

  return <RetailerChart type="line" data={data.data || []} />;
}
