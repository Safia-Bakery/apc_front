import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import apiClient from "src/main";
import { Departments, DistinctTypes, Sphere } from "src/utils/types";

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
  started_at = dayjs().startOf("month").format("YYYY-MM-DD"),
  finished_at = dayjs().format("YYYY-MM-DD"),
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
      apiClient
        .get("/v1/expanditure/distinct", {
          started_at,
          finished_at,
          sphere_status,
          department,
        })
        .then(({ data: response }) => {
          return response as DistinctTypes;
        }),
    enabled,
    refetchOnMount: true,
  });
};
export default useDistinct;
