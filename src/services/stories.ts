import { api } from "@/lib/api";

export interface StoriesPayload {
    year: string;
    title: string;
    body: string;
};

export interface StoryItems{
    _id: string;
    year: string;
    title: string;
    body: string;
};

export interface SingleStoryResponse{
    message: string;
    data: StoryItems;
};

export interface StoriesResponse{
    message: string;
    count: string;
    data: StoryItems[];
};

export const postStory = async (payload: StoriesPayload): Promise<SingleStoryResponse>=>{
    const {data} = await api.post<SingleStoryResponse>("/stories", payload);
    return data;
};

export const getStories = async (): Promise<StoriesResponse>=>{
    const {data} = await api.get<StoriesResponse>("/stories");
    return data;
};

export const updateStory = async (id: string, payload: StoriesPayload): Promise<SingleStoryResponse>=>{
    const {data} = await api.put<SingleStoryResponse>(`/stories/${id}`, payload);
    return data;
};

export const deleteStory = async (id: string)=>{
    const {data} = await api.delete(`/stories/${id}`);
    return data;
}

