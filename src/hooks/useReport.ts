import { TaskType } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

export default function useReport(type: TaskType) {
  return useQuery({
    queryKey: ['report', type],
    queryFn: () => {
      return fetch(`/api/reports?type=${type}`).then((res) => res.json());
    },
  });
}
