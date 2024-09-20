import { shallowEqual, useSelector } from "react-redux";
import { IRootState } from "../store/reducers/rootReducer";
import useRefreshToken from "./useRefreshToken";
import { useEffect } from "react";
import { authAPI } from "../../services/api";

const useAuthApi = () => {
    const refresh = useRefreshToken();
    const auth = useSelector((state: IRootState) => state.auth, shallowEqual);
    const { token } = auth;

    useEffect(() => {
        const requestInterceptor = authAPI.interceptors.request.use(
            config => {
                if(!config.headers["Authorization"]){
                    config.headers["Authorization"] = `Bearer ${token}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        )

        const responseInterceptor = authAPI.interceptors.response.use(
            response => response,
            async (error) => {
                const originalRequest = error?.config;
                if(error?.response?.status === 401 && !originalRequest?._retry){
                    originalRequest._retry = true;
                    try {
                        const token = await refresh();
                        originalRequest.headers["Authorization"] = `Bearer ${token}`;
                        return authAPI(originalRequest);
                    } catch (error) {
                        return Promise.reject(error);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            authAPI.interceptors.request.eject(requestInterceptor);
            authAPI.interceptors.response.eject(responseInterceptor);
        }
    },[token, refresh]);

    return authAPI;
}

export default useAuthApi;