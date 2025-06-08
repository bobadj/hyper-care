import { TaskType } from '@prisma/client';

import useReport from '@/hooks/useReport';

import Chart from '../Chart';
import Spinner from '../Spinner';

export default function SalesReport() {
  const { data, isLoading } = useReport(TaskType.SALE_REPORT);

  if (isLoading) {
    return <Spinner />;
  }

  return <Chart data={data.data || []} />;
}
