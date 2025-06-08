import { NextRequest, NextResponse } from 'next/server';
import { TaskType } from '@prisma/client';

import reportService from '@/services/reportService';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  try {
    const data = await reportService.getReport(
      searchParams.get('type') as TaskType,
    );
    // Do whatever you want
    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
