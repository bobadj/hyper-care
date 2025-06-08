import { TaskType } from '@prisma/client';

import useReport from '@/hooks/useReport';

import Spinner from '../Spinner';
import Product from '../Product';

export default function TradeMarketingActivityReport() {
  const { data, isLoading } = useReport(TaskType.TRADE_MARKETING_ACTIVITY);

  if (isLoading) {
    return <Spinner />;
  }

  return <Product.List list={data.data || []} />;
}
