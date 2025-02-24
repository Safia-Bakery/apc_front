import { useMutation, useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import {
  EPresetTimes,
  InvFactoryServiceStatTypes,
  InvRetailServiceStatTypes,
} from "@/utils/types";
import dayjs from "dayjs";
import { yearMonthDate } from "@/utils/keys";

interface Params {
  enabled?: boolean;
  finished_at?: string;
  started_at?: string;
  factory?: boolean;
}

const config = { timeout: EPresetTimes.MINUTE * 4 };

export const useInvServiseStatsRetail = ({
  enabled,
  started_at = dayjs().startOf("month").format(yearMonthDate),
  finished_at = dayjs().format(yearMonthDate),
  ...params
}: Params) => {
  return useQuery({
    queryKey: [
      "Service_Inventory_Stats_retail",
      finished_at,
      started_at,
      params,
    ],
    queryFn: () =>
      baseApi
        .get("/v1/stats/inventory", {
          params: {
            finished_at,
            started_at,
            ...params,
          },
          ...config,
        })
        .then(({ data: response }) => response as InvRetailServiceStatTypes),
    enabled,
    staleTime: EPresetTimes.MINUTE * 10,
    refetchOnMount: true,
  });
};

export const useInvServiseStatsFactory = ({
  enabled,
  started_at = dayjs().startOf("month").format(yearMonthDate),
  finished_at = dayjs().format(yearMonthDate),
  ...params
}: Params) => {
  return useQuery({
    queryKey: [
      "Service_Inventory_Stats_factory",
      finished_at,
      started_at,
      params,
    ],
    queryFn: () =>
      baseApi
        .get("/v1/stats/inventory/factory", {
          params: {
            finished_at,
            started_at,
            ...params,
          },
          ...config,
        })
        .then(({ data: response }) => response as InvFactoryServiceStatTypes),
    enabled,
    staleTime: EPresetTimes.MINUTE * 10,
    refetchOnMount: true,
  });
};

interface StatusBody {
  started_at?: string;
  finished_at?: string;
  report_type: number;
}

export const downloadFactoryStatsInv = () => {
  return useMutation({
    mutationKey: ["factory_stats_inv"],
    mutationFn: async ({
      started_at = dayjs().startOf("month").format(yearMonthDate),
      finished_at = dayjs().format(yearMonthDate),
      ...body
    }: StatusBody) => {
      const { data } = await baseApi.post(
        "/v1/stats/inventory/factory/excell",
        null,
        {
          params: {
            started_at,
            finished_at,
            ...body,
          },
        }
      );
      return data;
    },
  });
};
