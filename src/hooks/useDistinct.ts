import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import baseApi from "@/api/base_api";
import { Departments, DistinctTypes, Sphere } from "@/utils/types";
import { yearMonthDate } from "@/utils/keys";

interface BodyTypes {
  enabled?: boolean;
  timer?: number;
  department: Departments;
  sphere_status: Sphere;
  started_at?: string;
  finished_at?: string;
}

export const useDistinct = ({
  enabled = true,
  department,
  sphere_status,
  started_at = dayjs().startOf("month").format(yearMonthDate),
  finished_at = dayjs().format(yearMonthDate),
}: BodyTypes) => {
  return useQuery({
    queryKey: [
      "categories",
      started_at,
      finished_at,
      sphere_status,
      department,
    ],
    queryFn: () =>
      baseApi
        .get("/v1/expanditure/distinct", {
          params: {
            started_at,
            finished_at,
            sphere_status,
            department,
          },
        })
        .then(({ data: response }) => {
          return response as DistinctTypes;
        }),
    enabled,
    refetchOnMount: true,
  });
};
export default useDistinct;
