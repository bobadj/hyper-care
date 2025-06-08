import { NextRequest, NextResponse } from 'next/server';
import { format } from 'date-fns';

import { prisma } from '@/lib/db';
import { TaskType } from '@prisma/client';
import { SalesReportEntryType, SalesReportType } from '@/app/types';

// To handle a GET request to /api
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  try {
    const reports = await prisma.report.findMany({
      where: {
        tasks: {
          some: {
            type: searchParams.get('type') as TaskType,
          },
        },
      },
      include: {
        tasks: {
          where: {
            type: searchParams.get('type') as TaskType,
          },
        },
        pos: true,
      },
    });

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

    const formatted = Array.from(groupedByMonth.entries()).map(
      ([month, customers]) => ({
        name: month,
        retailer: Object.entries(customers).map(([name, value]) => ({
          name,
          value: Math.round(value / 1000),
        })),
      }),
    );

    // Do whatever you want
    return NextResponse.json({ data: formatted }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
