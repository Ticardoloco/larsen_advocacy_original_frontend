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
  image?: string | File;
}

export interface ProgramItem {
  _id: string;
  slug: string;
  name: string;
  tagline?: string;
  taglines?: string;
  category: string;
  body: string[];
  ctas?: string[];
  callout?: Callout;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProgramSingleResponse {
  message?: string;
  data: ProgramItem;
}

export interface ProgramListResponse {
  message?: string;
  count?: number;
  data: ProgramItem[];
}

/** Build FormData safely (works for both create & update) */
const createProgramFormData = (
  payload: Partial<ProgramPayload>,
): FormData => {
  const formData = new FormData();

  if (payload.name) {
    formData.append("name", payload.name);
  }

  // Handle both tagline / taglines
  if (payload.tagline) {
    formData.append("tagline", payload.tagline);
    formData.append("taglines", payload.tagline);
  }

  if (payload.category) {
    formData.append("category", payload.category);
  } else {
    formData.append("category", "General");
  }

  // Arrays
  if (Array.isArray(payload.body)) {
    payload.body.forEach((item) => {
      formData.append("body[]", item);
    });
  }

  if (Array.isArray(payload.ctas)) {
    payload.ctas.forEach((cta) => {
      formData.append("ctas[]", cta);
    });
  }

 
  if (payload.callout) {
    formData.append("callout[title]", payload.callout.title ?? "");
    formData.append("callout[body]", payload.callout.body ?? "");
  }


  if (payload.image instanceof File) {
    formData.append("image", payload.image);   // ← try "image" first
  } else if (typeof payload.image === "string" && payload.image.trim() !== "") {
    formData.append("image", payload.image);
  }

  return formData;
};



/** 1. CREATE PROGRAM */
export const postProgram = async (
  payload: ProgramPayload,
): Promise<ProgramSingleResponse> => {
  const formData = createProgramFormData(payload);
  const { data } = await api.post<ProgramSingleResponse>("/programs", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

/** 2. GET ALL PROGRAMS */
export const getPrograms = async (): Promise<ProgramItem[]> => {
  const response = await api.get<ProgramListResponse | ProgramItem[]>("/programs");

  if (Array.isArray(response.data)) {
    return response.data;
  }
  if (Array.isArray(response.data?.data)) {
    return response.data.data;
  }
  return [];
};

/** 3. GET PROGRAM BY SLUG */
export const getProgramBySlug = async (
  slug: string,
): Promise<ProgramItem | null> => {
  const response = await api.get<ProgramSingleResponse | ProgramItem>(
    `/programs/${slug}`,
  );

  if (response.data && "data" in response.data && response.data.data) {
    return response.data.data;
  }
  return (response.data as ProgramItem) || null;
};

/** 4. UPDATE PROGRAM */
export const updateProgram = async (
  id: string,
  payload: Partial<ProgramPayload>,
): Promise<ProgramSingleResponse> => {
  const formData = createProgramFormData(payload);
  const { data } = await api.put<ProgramSingleResponse>(
    `/programs/${id}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return data;
};

/** 5. DELETE PROGRAM BY ID */
export const deleteProgram = async (
  id: string,
): Promise<{ message?: string }> => {
  const { data } = await api.delete<{ message?: string }>(`/programs/${id}`);
  return data;
};