import { api } from "@/lib/api";

export interface FitTestPayload {
    fullName: string;
    email: string;
    answers: number[];
}

export interface FitTestResultItem{
    _id: string;
    fullName: string;
    email: string;
    score?: number;
    totalQuestions: number;
    percentage: number;
    status: string;
    createdAt?: string;
    updatedAt?: string; 
}

export interface SingleFitTestResponse{
    message: string;
    data: FitTestResultItem;
}

export interface FitTestResponse{
    message: string;
    count: number;
    data: FitTestResultItem[];
}

export const postFitTest = async(payload: FitTestPayload): Promise<SingleFitTestResponse>=>{
    const {data} = await api.post<SingleFitTestResponse>("/fit-test/submit", payload);
    return data;
};

export const getAllFitTests = async (): Promise<FitTestResponse>=>{
    const {data} = await api.get<FitTestResponse>("/fit-test/results");
    return data;
}