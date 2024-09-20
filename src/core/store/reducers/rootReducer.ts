import { combineReducers } from "redux";
import authSlice, { LoggedSession } from "../slices/authSlice";

export interface IRootState {
    auth: LoggedSession
}

const rootReducer = combineReducers({
    auth: authSlice,
});

export default rootReducer;