// import { api } from "@/lib/api";

// export interface Callout{
//     title: string;
//     body: string;
// }

// export interface ProgramPayload{
//     name: string;
//     taglines: string;
//     category: string;
//     body: string[];
//     ctas: string[];
//     callout: Callout;
//     image: string;
// }
//  export interface ProgramItem{
//     _id: string;
//     slug: string;
//     name: string;
//     taglines: string;
//     body: string[];
//     ctas: string[];
//     images: string;
//     category: string;
//  }

//  export interface ProgramResponse{
//     message: string;
//     count: number;
//     data: ProgramItem[];
//  }

//  export const postProgram = async (payload: ProgramPayload): Promise<ProgramResponse>=>{
//     const {data} = await api.post<ProgramResponse>("/programs", payload);
//     return data;
//  }

//  export const getPrograms = async (): Promise<ProgramResponse[]>=>{
//     const {data}= await api.get<ProgramResponse[]>("/programs");
//     return data;
//  }

//  export const getProgramBySlug = async (slug: string): Promise<ProgramResponse>=>{
//     const {data} = await api.get<ProgramResponse>(`/programs/${slug}`);
//     return data;
//  }

//  export const updateProgram = async (id: string, payload: ProgramPayload): Promise<ProgramResponse> =>{
//     const {data} = await api.put<ProgramResponse>(`/programs/${id}`, payload);
//     return data;
//  }

//  export const deleteProgram = async (id: string)=>{
//     const {data} = await api.delete(`/programs/${id}`);
//     return data;
//  }

import { api } from "@/lib/api";

export interface Callout {
  title: string;
  body: string;
}

export interface ProgramPayload {
  name: string;
  tagline: string;
  category: string;
  body: string[];
  ctas?: string[];
  callout?: Callout;
  image?: string;
}

export interface ProgramItem {
  _id: string;
  slug: string;
  name: string;
  taglines: string;
  category: string;
  body: string[];
  ctas?: string[];
  callout?: Callout;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Envelope for single item operations (POST, GET by slug, PUT)
export interface ProgramSingleResponse {
  message?: string;
  data: ProgramItem;
}

// Envelope for list operations (GET all)
export interface ProgramListResponse {
  message?: string;
  count?: number;
  data: ProgramItem[];
}

// 1. CREATE PROGRAM
export const postProgram = async (
  payload: ProgramPayload,
): Promise<ProgramSingleResponse> => {
  const { data } = await api.post<ProgramSingleResponse>("/programs", payload);
  return data;
};

// 2. GET ALL PROGRAMS (Returns un-wrapped list for easy UI mapping)
export const getPrograms = async (): Promise<ProgramItem[]> => {
  const response = await api.get<any>("/programs");

  // Safe array un-wrapping for both { data: [...] } and direct array response [...]
  if (Array.isArray(response.data)) {
    return response.data;
  }
  if (Array.isArray(response.data?.data)) {
    return response.data.data;
  }
  return [];
};

// 3. GET PROGRAM BY SLUG
export const getProgramBySlug = async (
  slug: string,
): Promise<ProgramItem | null> => {
  const response = await api.get<any>(`/programs/${slug}`);

  if (response.data?.data) {
    return response.data.data;
  }
  return response.data || null;
};

// 4. UPDATE PROGRAM BY ID
export const updateProgram = async (
  id: string,
  payload: Partial<ProgramPayload>,
): Promise<ProgramSingleResponse> => {
  const { data } = await api.put<ProgramSingleResponse>(
    `/programs/${id}`,
    payload,
  );
  return data;
};

// 5. DELETE PROGRAM BY ID
export const deleteProgram = async (
  id: string,
): Promise<{ message?: string }> => {
  const { data } = await api.delete<{ message?: string }>(`/programs/${id}`);
  return data;
};