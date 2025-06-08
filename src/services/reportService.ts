import { format } from 'date-fns';
import { POS, Report, Task, TaskType } from '@prisma/client';

import {
  SalesReportEntryType,
  SalesReportType,
  StockStatusReportEntryType,
  StockStatusReportType,
} from '@/types';
import { prisma } from '@/lib/db';

class ReportService {
  public async getReport(type: TaskType) {
    const data = await this.getReportData(type);
    switch (type) {
      case TaskType.TRADE_MARKETING_ACTIVITY:
        return await this.getTradeMarketingActivityReport(data);
      case TaskType.LINEUP_SAMPLE_PLACEMENT:
        return await this.getLineupSamplePlacementReport(data);
      case TaskType.STOCK_STATUS:
        return await this.getStockStatusReport(data);
      case TaskType.SALE_REPORT:
        return await this.getSalesReport(data);
      default:
        throw new Error('Invalid report type');
    }
  }

  private async getReportData(
    type: TaskType,
  ): Promise<Array<Report & { tasks: Task[]; pos: POS }>> {
    return await prisma.report.findMany({
      where: {
        tasks: {
          some: {
            type,
          },
        },
      },
      include: {
        tasks: {
          where: {
            type,
          },
        },
        pos: true,
      },
    });
  }

  private async getSalesReport(
    reports: Array<Report & { tasks: Task[]; pos: POS }>,
  ): Promise<
    Array<{ name: string; retailer: Array<{ name: string; value: number }> }>
  > {
    const groupedByMonth = new Map<string, { [retailer: string]: number }>();
    for (const report of reports) {
      const monthKey = format(report.date, 'MMM yyyy'); // e.g., "Jan 2024"
      const retailerName = report.pos.name;

      for (const task of report.tasks) {
        const totalRevenue = ((task.data || []) as SalesReportType).reduce(
          (sum: number, item: SalesReportEntryType) => sum + item.revenue,
          0,
        );

        if (!groupedByMonth.has(monthKey)) {
          groupedByMonth.set(monthKey, {});
        }

        const customerMap = groupedByMonth.get(monthKey)!;
        customerMap[retailerName] =
          (customerMap[retailerName] || 0) + totalRevenue;
      }
    }

    return Array.from(groupedByMonth.entries()).map(([month, retailer]) => ({
      name: month,
      retailer: Object.entries(retailer).map(([name, value]) => ({
        name,
        value: Math.round(value / 1000),
      })),
    }));
  }

  private async getStockStatusReport(
    reports: Array<Report & { tasks: Task[]; pos: POS }>,
  ): Promise<
    Array<{ name: string; retailer: Array<{ name: string; value: number }> }>
  > {
    const groupedByMonth = new Map<string, { [retailer: string]: number }>();
    for (const report of reports) {
      const monthKey = format(report.date, 'MMM yyyy'); // e.g., "Jan 2024"
      const retailerName = report.pos.name;

      for (const task of report.tasks) {
        const totalRevenue = (
          (task.data || []) as StockStatusReportType
        ).reduce(
          (sum: number, item: StockStatusReportEntryType) =>
            sum + item.quantity,
          0,
        );

        if (!groupedByMonth.has(monthKey)) {
          groupedByMonth.set(monthKey, {});
        }

        const customerMap = groupedByMonth.get(monthKey)!;
        customerMap[retailerName] =
          (customerMap[retailerName] || 0) + totalRevenue;
      }
    }

    return Array.from(groupedByMonth.entries()).map(([month, retailer]) => ({
      name: month,
      retailer: Object.entries(retailer).map(([name, value]) => ({
        name,
        value: Math.round(value / 1000),
      })),
    }));
  }

  private async getLineupSamplePlacementReport(
    reports: Array<Report & { tasks: Task[]; pos: POS }>,
  ) {
    const placementEntries = reports.flatMap((report) =>
      report.tasks.map((task) => {
        const data = task.data as {
          lineup: string[];
          reported: string[];
        };

        const lineupSet = new Set(data.lineup || []);
        const reportedSet = new Set(data.reported || []);

        const lineupSize = lineupSet.size || 1;
        const reportedSize = reportedSet.size;
        const overlapCount = [...reportedSet].filter((id) =>
          lineupSet.has(id),
        ).length;
        const nonLineupCount = reportedSize - overlapCount;

        return {
          retailer: report.pos.name,
          samplePlacementTotal: reportedSize,
          lineupSamplePlacementTotal: overlapCount,
          nonLineupPlacementTotal: nonLineupCount,
          lineupSize,
        };
      }),
    );
    const placementRankEntries = reports.flatMap((report) =>
      report.tasks.map((task) => {
        const data = task.data as {
          lineup: string[];
          reported: string[];
        };

        const lineup = new Set(data.lineup || []);
        const reported = new Set(data.reported || []);

        const lineupSize = lineup.size || 1;
        const overlapCount = [...reported].filter((id) =>
          lineup.has(id),
        ).length;

        return {
          retailer: report.pos.name,
          pointOfSale: `${report.pos.name}, ${report.pos.location}`,
          percentage: +((overlapCount / lineupSize) * 100).toFixed(2),
        };
      }),
    );

    // Aggregate by retailer
    const retailerMap = new Map<
      string,
      {
        samplePlacementTotal: number;
        lineupSamplePlacementTotal: number;
      }
    >();

    let globalReported = 0;
    let globalLineup = 0;
    let globalOverlap = 0;
    let globalNonLineup = 0;

    for (const entry of placementEntries) {
      const {
        retailer,
        samplePlacementTotal,
        lineupSamplePlacementTotal,
        nonLineupPlacementTotal,
        lineupSize,
      } = entry;

      if (!retailerMap.has(retailer)) {
        retailerMap.set(retailer, {
          samplePlacementTotal: 0,
          lineupSamplePlacementTotal: 0,
        });
      }

      const acc = retailerMap.get(retailer)!;
      acc.samplePlacementTotal += samplePlacementTotal;
      acc.lineupSamplePlacementTotal += lineupSamplePlacementTotal;

      globalReported += samplePlacementTotal;
      globalOverlap += lineupSamplePlacementTotal;
      globalNonLineup += nonLineupPlacementTotal;
      globalLineup += lineupSize;
    }

    // Final output
    const result = Array.from(retailerMap.entries()).map(
      ([retailer, values]) => ({
        retailer,
        samplePlacementTotal: values.samplePlacementTotal,
        lineupSamplePlacementTotal: values.lineupSamplePlacementTotal,
      }),
    );

    const samplePlacement = +((globalReported / globalLineup) * 100).toFixed(2);
    const lineupSamplePlacement = +(
      (globalOverlap / globalLineup) *
      100
    ).toFixed(2);

    return {
      result,
      samplePlacement,
      lineupSamplePlacement,
      nonLineupPlacementTotal: globalNonLineup,
      table: placementRankEntries
        .sort((a, b) => b.percentage - a.percentage)
        .map((entry, index) => ({
          rank: index + 1,
          ...entry,
        })),
    };
  }

  private async getTradeMarketingActivityReport(
    reports: Array<Report & { tasks: Task[]; pos: POS }>,
  ) {
    const productsMap = await prisma.product
      .findMany({
        select: {
          sku: true,
          name: true,
        },
      })
      .then((list) => Object.fromEntries(list.map((p) => [p.sku, p.name])));

    console.log(reports.length);

    return reports.flatMap((report) =>
      report.tasks.flatMap((task) => {
        const activities = (task.data as any) || [];

        return activities.map((activity: any) => ({
          retailer: report.pos.name,
          pointOfSale: report.pos.location,
          product: productsMap[activity.productSku] || 'Unknown Product',
          date: report.date,
          isPresent: activity.isPresent,
          type: activity.type,
          brand: activity.brand,
        }));
      }),
    );
  }
}

const reportService = new ReportService();

export default reportService;
