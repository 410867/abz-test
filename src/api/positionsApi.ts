import { axiosInstance } from './axiosInstance';

export type Position = { id: number; name: string };
export type PositionsResponse = { positions: Position[] };

export const getPositions = async (): Promise<PositionsResponse> => {
    const { data } = await axiosInstance.get('/positions');
    return data;
};

export const getToken = async (): Promise<string> => {
    const { data } = await axiosInstance.get('/token');
    return data.token as string;
};

export const registerUser = async (formData: FormData) => {
    const token = await getToken();
    const { data } = await axiosInstance.post('/users', formData, {
        headers: {
            Token: token,
        },
    });
    return data;
};
