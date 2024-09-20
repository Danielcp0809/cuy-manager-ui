import { api } from "../../services/api";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setLogoutSession, setNewTokenData } from "../store/slices/authSlice";
import { IRootState } from "../store/reducers/rootReducer";

const useRefreshToken = () => {
    const dispatch = useDispatch();
    const { refreshToken } = useSelector((state: IRootState) => state.auth, shallowEqual);
    const refresh = async () => {
        try {
            const response = await api.post('/auth/refresh',{
                refresh_token: refreshToken
            });
            const { access_token } = response.data;
            dispatch(setNewTokenData({ token: access_token }));
            return access_token;
        } catch (error: any) {
            if(error.response.status === 403){
                dispatch(setLogoutSession());
            }
        }
    }
    return refresh;
}

export default useRefreshToken;