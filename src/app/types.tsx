export type ColorType = `#${string}`;

export type LineupType = {
  rank: number;
  retailer: string;
  pointOfSale: string;
  percentage: number;
};

export type SalesReportType = {
  retailer: string;
  data: Array<SalesReportEntryType>;
};

export type SalesReportEntryType = {
  productSku: string;
  price: number;
  quantity: number;
  revenue: number;
};
