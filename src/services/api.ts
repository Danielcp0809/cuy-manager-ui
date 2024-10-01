import axios from 'axios';
import { API_URL } from '../shared/constants';
import { IAuthResponse } from '../interfaces/api/auth-enterprise.interface';

export const api = axios.create({
    baseURL: API_URL,
});

export const authAPI = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
})

export const login = async (username: string, password: string) => {
    console.log(process.env.API_URL);
    const response = await axios.post<IAuthResponse>(`${API_URL}/auth/login`, { username, password });
    return response.data;
}