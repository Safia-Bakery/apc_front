import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { Category, EPresetTimes } from "@/utils/types";
import {
  CategoriesTools,
  CategoryToolParams,
  DivisionRes,
  FactoryDivisionBody,
  FactoryDivisionParams,
  FactoryDivisionRes,
  FactoryManagersParams,
  FactoryRequestBody,
  FactoryRequestParams,
  FactoryRequestRes,
  ManagerBody,
  ManagerRes,
  ToolRes,
  ToolsBody,
  ToolsParams,
  ToolsProductsType,
  ToolsRes,
} from "@/Types/factory";

export const getApcFactoryRequest = ({
  id,
  enabled,
}: {
  id: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["factory_request_v2", id],
    queryFn: ({ signal }) =>
      baseApi
        .get(`/api/v2/arc/factory/requests/${id}`, {
          signal,
        })
        .then(({ data: response }) => (response as FactoryRequestRes) || null),
    enabled,
    staleTime: EPresetTimes.MINUTE * 4,
  });
};

export const getApcFactoryRequests = ({
  enabled,
  ...params
}: FactoryRequestParams) => {
  return useQuery({
    queryKey: ["ApcFactory_requests", params],
    queryFn: ({ signal }) =>
      baseApi
        .get("/api/v2/arc/factory/requests", {
          params,
          signal,
        })
        .then(
          ({ data: response }) =>
            (response as BasePaginateRes<FactoryRequestRes>) || null
        ),
    enabled,
  });
};

export const apcFactoryRequestMutation = () => {
  return useMutation({
    mutationKey: ["ApcFactory_request_mutation"],
    mutationFn: async (body: FactoryRequestBody) => {
      const { data } = await baseApi.put(
        `/api/v2/arc/factory/requests/${body.id}`,
        body
      );
      return data;
    },
  });
};

export const getApcFactoryManager = ({
  id,
  enabled,
}: {
  id: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["factory_manager_v2", id],
    queryFn: ({ signal }) =>
      baseApi
        .get(`/api/v2/arc/factory/managers/${id}`, {
          signal,
        })
        .then(({ data: response }) => (response as ManagerRes) || null),
    enabled,
    staleTime: EPresetTimes.MINUTE * 4,
  });
};

export const getApcFactoryManagers = ({
  enabled,
  ...params
}: FactoryManagersParams) => {
  return useQuery({
    queryKey: ["ApcFactory_managers", params],
    queryFn: ({ signal }) =>
      baseApi
        .get("/api/v2/arc/factory/managers", {
          params,
          signal,
        })
        .then(
          ({ data: response }) =>
            (response as BasePaginateRes<ManagerRes>) || null
        ),
    enabled,
  });
};

export const factoryManagersMutation = () => {
  return useMutation({
    mutationKey: ["factory_managers_mutation"],
    mutationFn: async (body: ManagerBody) => {
      if (body.id) {
        const { data } = await baseApi.put(
          `/api/v2/arc/factory/managers/${body.id}`,
          body
        );
        return data;
      } else {
        const { data } = await baseApi.post(
          "/api/v2/arc/factory/managers",
          body
        );
        return data;
      }
    },
  });
};

export const getApcFactoryDivision = ({
  id,
  enabled,
}: {
  id: string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["factory_Division_v2", id],
    queryFn: ({ signal }) =>
      baseApi
        .get(`/api/v2/arc/factory/divisions/${id}`, {
          signal,
        })
        .then(({ data: response }) => (response as DivisionRes) || null),
    enabled,
    staleTime: EPresetTimes.MINUTE * 4,
  });
};

export const getApcFactoryDivisions = ({
  enabled,
  ...params
}: FactoryDivisionParams) => {
  return useQuery({
    queryKey: ["ApcFactory_divisions", params],
    queryFn: ({ signal }) =>
      baseApi
        .get("/api/v2/arc/factory/divisions", {
          params,
          signal,
        })
        .then(
          ({ data: response }) =>
            (response as BasePaginateRes<FactoryDivisionRes>) || null
        ),
    enabled,
  });
};

export const factoryDivisionMutation = () => {
  return useMutation({
    mutationKey: ["factory_Division_mutation"],
    mutationFn: async (body: FactoryDivisionBody) => {
      if (body.id) {
        const { data } = await baseApi.put(
          `/api/v2/arc/factory/divisions/${body.id}`,
          body
        );
        return data;
      } else {
        const { data } = await baseApi.post(
          "/api/v2/arc/factory/divisions",
          body
        );
        return data;
      }
    },
  });
};

export const getInvFactoryTool = ({
  id,
  enabled,
}: {
  id: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["factory_tool_v2", id],
    queryFn: ({ signal }) =>
      baseApi
        .get(`/api/v2/inventory/factory/tools/${id}`, {
          signal,
        })
        .then(({ data: response }) => (response as ToolRes) || null),
    enabled,
    staleTime: EPresetTimes.MINUTE * 4,
  });
};

export const getInvFactoryTools = ({ enabled, ...params }: ToolsParams) => {
  return useQuery({
    queryKey: ["ApcFactory_tools", params],
    queryFn: ({ signal }) =>
      baseApi
        .get("/api/v2/inventory/factory/tools", {
          params,
          signal,
        })
        .then(({ data: response }) => (response as ToolsRes) || null),
    enabled,
    staleTime: EPresetTimes.MINUTE * 4,
  });
};

export const factoryToolMutation = () => {
  return useMutation({
    mutationKey: ["factory_tool_mutation"],
    mutationFn: async (body: ToolsBody) => {
      const { data } = await baseApi.put(
        `/api/v2/inventory/factory/tools/${body.id}`,
        body
      );
      return data;
    },
  });
};

export const getInvFactoryCategories = ({
  enabled,
  status,
}: {
  enabled?: boolean;
  status?: number;
}) => {
  return useQuery({
    queryKey: ["ApcFactory_categories", status],
    queryFn: ({ signal }) =>
      baseApi
        .get("/api/v2/inventory/factory/categories/", {
          params: { status },
          signal,
        })
        .then(
          ({ data: response }) =>
            (response as BasePaginateRes<Category>) || null
        ),
    enabled,
  });
};

export const getInvFactoryCategoriesTools = ({
  enabled,
  ...params
}: CategoryToolParams) => {
  return useQuery({
    queryKey: ["ApcFactory_categories_tools", params],
    queryFn: ({ signal }) =>
      baseApi
        .get("/api/v2/inventory/factory/categories/tools", {
          params,
          signal,
        })
        .then(
          ({ data: response }) =>
            (response as BasePaginateRes<ToolsProductsType>) || null
        ),
    enabled,
  });
};
