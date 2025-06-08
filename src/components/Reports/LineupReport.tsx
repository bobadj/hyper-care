import { TaskType } from '@prisma/client';

import useReport from '@/hooks/useReport';
import Lineup from '../Lineup';
import Spinner from '../Spinner';

export default function LineupReport() {
  const { data, isLoading } = useReport(TaskType.LINEUP_SAMPLE_PLACEMENT);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-2 mb-4">
        <Lineup
          title="Lineup sample placement"
          data={data.data.result}
          value={data.data.lineupSamplePlacement}
        />
        <Lineup
          title="Sample placement"
          data={data.data.result}
          valueKey="samplePlacementTotal"
          value={data.data.samplePlacement}
        />
        <Lineup
          title="Non-lineup products"
          data={[]}
          value={data.data.nonLineupPlacementTotal}
        />
      </div>
      <Lineup.Table data={data.data.table} />
    </div>
  );
}
