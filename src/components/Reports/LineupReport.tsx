import { TaskType } from '@prisma/client';

import useReport from '@/hooks/useReport';

import Chart from '../Chart';
import Table from '../Table';
import Spinner from '../Spinner';

export default function LineupReport() {
  const { data, isLoading } = useReport(TaskType.LINEUP_SAMPLE_PLACEMENT);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-2 mb-4">
        <Chart.Pie
          title="Lineup sample placement"
          data={data.data.result}
          value={data.data.lineupSamplePlacement}
        />
        <Chart.Pie
          title="Sample placement"
          data={data.data.result}
          valueKey="samplePlacementTotal"
          value={data.data.samplePlacement}
        />
        <Chart.Pie
          title="Non-lineup products"
          data={[]}
          value={data.data.nonLineupPlacementTotal}
        />
      </div>
      <Table data={data.data.table} />
    </div>
  );
}
