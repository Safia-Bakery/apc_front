import baseApi from "@/api/base_api";
import { EPresetTimes } from "@/utils/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useKruCategories = ({ enabled, ...params }: KruCategoryParams) => {
  return useQuery({
    queryKey: ["kru/categories", params],
    queryFn: () =>
      baseApi
        .get(`/kru/categories/`, { params })
        .then(
          ({ data: response }) =>
            (response as BasePaginateRes<KruCategoryRes>) || null
        ),
    enabled,
    staleTime: EPresetTimes.MINUTE * 4,
    refetchOnMount: true,
  });
};

export const useKruCategory = ({ enabled, id }: KruCategoryParams) => {
  return useQuery({
    queryKey: ["kru_category", id],
    queryFn: () =>
      baseApi
        .get(`/kru/categories/${id}`)
        .then(({ data: response }) => (response as KruCategoryRes) || null),
    enabled: enabled && !!id,
    refetchOnMount: true,
    staleTime: EPresetTimes.MINUTE * 4,
  });
};

export const editAddKruCategoryMutation = () => {
  return useMutation({
    mutationKey: ["edit_add_KruCategory"],
    mutationFn: async (body: KruCategoryBody) => {
      const { data } = await baseApi[!body.id ? "post" : "put"](
        "/kru/categories/",
        body
      );
      return data;
    },
  });
};

export const kruCategoryDeletion = () => {
  return useMutation({
    mutationKey: ["delete_KruCategory"],
    mutationFn: async (id: number) => {
      const { data } = await baseApi.delete(`/kru/categories/${id}`);
      return data;
    },
  });
};

export const useKruTasks = ({ enabled, ...params }: KruTaskParams) => {
  return useQuery({
    queryKey: ["kru/Tasks", params],
    queryFn: () =>
      baseApi
        .get(`/kru/tasks/`, { params })
        .then(
          ({ data: response }) =>
            (response as BasePaginateRes<KruTaskRes>) || null
        ),
    enabled,
    refetchOnMount: true,
    staleTime: EPresetTimes.MINUTE * 4,
  });
};

export const useKruTask = ({ enabled, id }: KruTaskParams) => {
  return useQuery({
    queryKey: ["kru_Task", id],
    queryFn: () =>
      baseApi
        .get(`/kru/tasks/${id}`)
        .then(({ data: response }) => (response as KruTaskRes) || null),
    enabled: enabled && !!id,
    refetchOnMount: true,
    staleTime: EPresetTimes.MINUTE * 4,
  });
};

export const editAddKruTaskMutation = () => {
  return useMutation({
    mutationKey: ["edit_add_KruTask"],
    mutationFn: async (body: KruTaskBody) => {
      const { data } = await baseApi[!body.id ? "post" : "put"](
        "/kru/tasks/",
        body
      );
      return data;
    },
  });
};

export const kruTaskDeletion = () => {
  return useMutation({
    mutationKey: ["delete_KruTask"],
    mutationFn: async (id: number) => {
      const { data } = await baseApi.delete(`/kru/tasks/${id}`);
      return data;
    },
  });
};

export const kruFinishedTasks = () => {
  return useMutation({
    mutationKey: ["finished_KruTask"],
    mutationFn: async (body: FinishedTasksBody[]) => {
      const { data } = await baseApi.post("/kru/finished-tasks/", body);
      return data;
    },
  });
};

export const useKruAvailableTask = ({
  enabled,
  ...params
}: KruAvailableTaskParams) => {
  return useQuery({
    queryKey: ["kru_available_tasks", params],
    queryFn: () =>
      baseApi
        .get("/kru/tasks/available/", { params })
        .then(({ data: response }) => (response as KruTaskRes[]) || null),
    enabled,
    refetchOnMount: true,
    staleTime: EPresetTimes.MINUTE * 4,
  });
};
