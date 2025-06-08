import { TaskType } from '@prisma/client';

import SalesReport from './SalesReport';
import StockStatusReport from './StockStatusReport';
import LineupReport from './LineupReport';
import TradeMarketingActivityReport from './TradeMarketingActivityReport';
import BrandShareReport from './BrandShareReport';

export default function Reports({ type }: { type: TaskType }) {
  switch (type) {
    case TaskType.SALE_REPORT:
      return <SalesReport />;
    case TaskType.STOCK_STATUS:
      return <StockStatusReport />;
    case TaskType.LINEUP_SAMPLE_PLACEMENT:
      return <LineupReport />;
    case TaskType.TRADE_MARKETING_ACTIVITY:
      return <TradeMarketingActivityReport />;
    case TaskType.BRAND_SHARE:
      return <BrandShareReport />;
    default:
      return null;
  }
}

export {
  SalesReport,
  StockStatusReport,
  LineupReport,
  TradeMarketingActivityReport,
  BrandShareReport,
};
