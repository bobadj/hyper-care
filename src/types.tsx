import { POS, Task } from '@prisma/client';

export type ColorType = `#${string}`;

export type LineupType = {
  rank: number;
  retailer: string;
  pointOfSale: string;
  percentage: number;
};

export type ReportWithTasksAndPos = Report & { tasks: Task[]; pos: POS };

export type SalesReportType = Array<SalesReportEntryType>;
export type StockStatusReportType = Array<StockStatusReportEntryType>;
export type LineupSamplePlacementReportType =
  Array<LineupSamplePlacementEntryType>;

export type SalesReportEntryType = {
  productSku: string;
  price: number;
  quantity: number;
  revenue: number;
};

export type StockStatusReportEntryType = {
  productSku: string;
  price: number;
  quantity: number;
};

export type LineupSamplePlacementEntryType = {
  reported: string[];
  lineup: string[];
};
