import { api } from "@/lib/api";

export interface ImpactPayload {
  value: number;
  suffix: string;
  label: string;
}

export interface ImpactItem {
  _id: string;
  value: number;
  suffix: string;
  label: string;
  createdAt?: string;
}

export interface ImpactSingleResponse {
  message?: string;
  data: ImpactItem;
}

export interface ImpactListResponse {
  message?: string;
  count?: number;
  data: ImpactItem[];
}

export const postImpact = async (
  payload: ImpactPayload,
): Promise<ImpactSingleResponse> => {
  const { data } = await api.post<ImpactSingleResponse>("/impacts", payload);
  return data;
};

export const getImpacts = async (): Promise<ImpactItem[]> => {
  const response = await api.get<any>("/impacts");

  if (Array.isArray(response.data)) {
    return response.data;
  }
  if (Array.isArray(response.data?.data)) {
    return response.data.data;
  }
  return [];
};

export const updateImpact = async (
  id: string,
  payload: Partial<ImpactPayload>,
): Promise<ImpactSingleResponse> => {
  const { data } = await api.put<ImpactSingleResponse>(`/impacts/${id}`, payload);
  return data;
};

export const deleteImpact = async (
  id: string,
): Promise<{ message?: string }> => {
  const { data } = await api.delete<{ message?: string }>(`/impacts/${id}`);
  return data;
};