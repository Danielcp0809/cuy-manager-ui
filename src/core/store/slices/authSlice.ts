import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAuthEnterprise } from '../../../interfaces/auth-enterprise.interface';

export interface LoggedSession {
    enterprise?: IAuthEnterprise | null;
    token?: string | null,
    refreshToken?: string | null,
    isLoggedIn?: boolean,
}

const initialState: LoggedSession = {
    enterprise: null,
    token: null,
    refreshToken: null,
    isLoggedIn: false,
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoginSession: (state: LoggedSession, action: PayloadAction<LoggedSession>) => {
            state.enterprise = action.payload.enterprise;
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
            state.isLoggedIn = true;
        },
        setNewTokenData: (state: LoggedSession, action: PayloadAction<LoggedSession>) => {
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
        },
        setLogoutSession: (state: LoggedSession) => {
            state.enterprise = null;
            state.token = null;
            state.refreshToken = null;
            state.isLoggedIn = false;
        },
    },
});

export const { setLoginSession, setLogoutSession, setNewTokenData} = authSlice.actions;

export default authSlice.reducer;