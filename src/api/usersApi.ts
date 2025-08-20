import { axiosInstance } from './axiosInstance';

export type User = {
    id: number;
    name: string;
    photo: string;
    position: string;
    email: string;
    phone: string;
    registration_timestamp: number;
};

export type UsersResponse = {
    page: number;
    total_pages: number;
    links: { next_url: string | null; prev_url: string | null };
    users: User[];
};

export const getUsers = async (page = 1, count = 6) => {
    const { data } = await axiosInstance.get<UsersResponse>('/users', {
        params: { page, count },
    });
    return data;
};
