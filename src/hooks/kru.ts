import baseApi from "@/api/base_api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useKruCategories = ({ enabled, ...params }: KruCategoryParams) => {
  return useQuery({
    queryKey: ["kru_categories", params],
    queryFn: () =>
      baseApi
        .get(`/kru_categories/`, { params })
        .then(
          ({ data: response }) =>
            (response as BasePaginateRes<KruCategoryRes>) || null
        ),
    enabled,
    refetchOnMount: true,
  });
};

export const useKruCategory = ({ enabled, id }: KruCategoryParams) => {
  return useQuery({
    queryKey: ["kru_category", id],
    queryFn: () =>
      baseApi
        .get(`/kru_categories/${id}`)
        .then(({ data: response }) => (response as KruCategoryRes) || null),
    enabled: enabled && !!id,
    refetchOnMount: true,
  });
};

export const editAddKruCategoryMutation = () => {
  return useMutation({
    mutationKey: ["edit_add_KruCategory"],
    mutationFn: async (body: KruCategoryBody) => {
      if (!body.id) {
        const { data } = await baseApi.post("/kru_categories/", body);
        return data;
      } else {
        const { data } = await baseApi.put("/kru_categories/", body);
        return data;
      }
    },
  });
};

export const kruCategoryDeletion = () => {
  return useMutation({
    mutationKey: ["delete_KruCategory"],
    mutationFn: async (id: number) => {
      const { data } = await baseApi.delete(`/kru_categories/${id}`);
      return data;
    },
  });
};

export const useKruTasks = ({ enabled, ...params }: KruTaskParams) => {
  return useQuery({
    queryKey: ["kru_Tasks", params],
    queryFn: () =>
      baseApi
        .get(`/kru_tasks/`, { params })
        .then(
          ({ data: response }) =>
            (response as BasePaginateRes<KruTaskRes>) || null
        ),
    enabled,
    refetchOnMount: true,
  });
};

export const useKruTask = ({ enabled, id }: KruTaskParams) => {
  return useQuery({
    queryKey: ["kru_Task", id],
    queryFn: () =>
      baseApi
        .get(`/kru_tasks/${id}`)
        .then(({ data: response }) => (response as KruTaskRes) || null),
    enabled: enabled && !!id,
    refetchOnMount: true,
  });
};

export const editAddKruTaskMutation = () => {
  return useMutation({
    mutationKey: ["edit_add_KruTask"],
    mutationFn: async (body: KruTaskBody) => {
      if (!body.id) {
        const { data } = await baseApi.post("/kru_tasks/", body);
        return data;
      } else {
        const { data } = await baseApi.put("/kru_tasks/", body);
        return data;
      }
    },
  });
};

export const kruTaskDeletion = () => {
  return useMutation({
    mutationKey: ["delete_KruTask"],
    mutationFn: async (id: number) => {
      const { data } = await baseApi.delete(`/kru_tasks/${id}`);
      return data;
    },
  });
};
