'use client';

import { TaskType } from '@prisma/client';

import Tabs from '@/components/Tabs';
import Reports from '@/components/Reports';

export default function Home() {
  const tabData = [
    {
      label: 'Sales Report',
      content: <Reports type={TaskType.SALE_REPORT} />,
    },
    {
      label: 'Stock Status',
      content: <Reports type={TaskType.STOCK_STATUS} />,
    },
    {
      label: 'Lineup Sample Placement',
      content: <Reports type={TaskType.LINEUP_SAMPLE_PLACEMENT} />,
    },
    {
      label: 'Trade Marketing Activity',
      content: <Reports type={TaskType.TRADE_MARKETING_ACTIVITY} />,
    },
    {
      label: 'Brand Share',
      content: <Reports type={TaskType.BRAND_SHARE} />,
    },
  ];

  return <Tabs tabs={tabData} />;
}
