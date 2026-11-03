import { api } from "@/lib/api";

export interface ImagePayload {
  image: File;
};

export interface ImageData {
  url: string;
  publicId: string;
  _id?: string;
  createdAt?: string;
};

export interface HomeImageItem {
  _id?: string;
  message?: string;
  data: ImageData;
};

export interface GetHomeImagesResponse {
  message?: string;
  count?: number;
  data: HomeImageItem[];
};

export interface GalleryPayload {
  caption: string;
  category: string;
  year: string;
  tone?: number;
  image: File | string;
};

export interface GalleryItems{
  _id: string;
  caption: string;
  category: string;
  year: string;
  tone: number;
  image: string;
};

export interface SingleGalleryResponse{
  message: string;
  data: GalleryItems
};

export interface GalleryResponse{
  message: string;
  count: number;
  data: GalleryItems[];
};


export const postHomeImage = async (payload: ImagePayload) => {
  const formData = new FormData();
  formData.append("image", payload.image);
  
  const { data } = await api.post("/home-images", formData, {
    headers: {
      "Content-Type": undefined,
    } as any,
  });
  return data;
};

export const getHomeImage = async (): Promise<HomeImageItem[]> => {
  const response = await api.get<any>("/home-images");
  
  // Handles whether the API returns an array directly `[...]` or wrapped `{ data: [...] }`
  if (Array.isArray(response.data)) {
    return response.data;
  }
  if (Array.isArray(response.data?.data)) {
    return response.data.data;
  }
  return [];
};


export const postGallery = async (payload: GalleryPayload) => {
  const formData = new FormData();
  formData.append("caption", payload.caption);
  formData.append("category", payload.category);
  formData.append("year", payload.year);
  formData.append("tone", (payload.tone ?? 0).toString());

  // Attach file if selected
  if (payload.image instanceof File) {
    formData.append("image", payload.image);
  } else if (typeof payload.image === "string") {
    formData.append("image", payload.image);
  }

  const { data } = await api.post("/gallery", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
export const getAllGallerys = async (): Promise<GalleryResponse>=>{
  const {data} = await api.get<GalleryResponse>("/gallery");
  return data;
};

export const updateGallery = async (id: string, payload: GalleryPayload): Promise<SingleGalleryResponse> => {
  const formData = new FormData();
  formData.append("caption", payload.caption);
  formData.append("category", payload.category);
  formData.append("year", payload.year);
  formData.append("tone", (payload.tone ?? 0).toString());

  // Attach file or existing image URL string
  if (payload.image instanceof File) {
    formData.append("image", payload.image);
  } else if (typeof payload.image === "string") {
    formData.append("image", payload.image);
  }

  const { data } = await api.put<SingleGalleryResponse>(`/gallery/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteGallery = async (id: string)=>{
  const {data} = await api.delete(`/gallery/${id}`);
  return data;
}

