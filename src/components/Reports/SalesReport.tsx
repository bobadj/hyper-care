import { TaskType } from '@prisma/client';

import useReport from '@/hooks/useReport';

import Spinner from '../Spinner';
import RetailerChart from '../RetailerChart';

export default function SalesReport() {
  const { data, isLoading } = useReport(TaskType.SALE_REPORT);

  if (isLoading) {
    return <Spinner />;
  }

  return <RetailerChart data={data.data || []} />;
}
