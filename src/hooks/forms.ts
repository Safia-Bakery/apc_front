import baseApi from "@/api/base_api";
import { EPresetTimes } from "@/utils/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const getFormRequest = ({
  id,
  enabled,
}: {
  id: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["form_request", id],
    queryFn: ({ signal }) =>
      baseApi
        .get(`/api/v2/requests/uniform/${id}/`, {
          signal,
        })
        .then(({ data: response }) => (response as FormRes) || null),
    enabled,
    staleTime: EPresetTimes.MINUTE * 4,
  });
};

export const getFormRequests = ({ enabled, ...params }: FormParams) => {
  return useQuery({
    queryKey: ["edit_add_form_reqs", params],
    queryFn: ({ signal }) =>
      baseApi
        .get("/api/v2/requests/uniform/", {
          params,
          signal,
        })
        .then(
          ({ data: response }) => (response as BasePaginateRes<FormRes>) || null
        ),
    enabled,
    staleTime: EPresetTimes.MINUTE * 4,
  });
};

export const editFormRequests = () => {
  return useMutation({
    mutationKey: ["edit_add_form_reqs"],
    mutationFn: async (body: FormBody) => {
      const { data } = await baseApi.put(
        `/api/v2/requests/uniform/${body.id}/`,
        body
      );
      return data;
    },
  });
};

export const addFormRequests = () => {
  return useMutation({
    mutationKey: ["add_form_reqs"],
    mutationFn: async (body: FormCreateBody) => {
      const { data } = await baseApi.post(`/api/v2/requests/uniform/`, body);
      return data;
    },
  });
};

export const getFormCategory = ({
  id,
  enabled,
}: {
  id: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["form_categories", id],
    queryFn: ({ signal }) =>
      baseApi
        .get(`/api/v2/category/uniform/${id}/`, {
          signal,
        })
        .then(({ data: response }) => (response as FormCategoryRes) || null),
    enabled,
    staleTime: EPresetTimes.MINUTE * 4,
  });
};

export const getFormCategories = ({
  enabled,
  ...params
}: FormCategoryParams) => {
  return useQuery({
    queryKey: ["get_form_categories", params],
    queryFn: ({ signal }) =>
      baseApi
        .get("/api/v2/category/uniform/", {
          params,
          signal,
        })
        .then(({ data: response }) => (response as FormCategoryRes[]) || null),
    enabled,
    staleTime: EPresetTimes.MINUTE * 4,
  });
};

export const editAddFormCategory = () => {
  return useMutation({
    mutationKey: ["edit_add_form_category"],
    mutationFn: async (body: FormCategoryBody) => {
      const { data } = await baseApi[body.id ? "put" : "post"](
        `/api/v2/category/uniform/`,
        body
      );
      return data;
    },
  });
};
