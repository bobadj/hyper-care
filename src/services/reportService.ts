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
}

const reportService = new ReportService();

export default reportService;
