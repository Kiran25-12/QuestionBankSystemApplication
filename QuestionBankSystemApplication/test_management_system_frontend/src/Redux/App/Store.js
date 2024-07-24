import { configureStore } from '@reduxjs/toolkit';
import LoginReducer from '../Feature/AuthSlices/LoginSlice';
import SignupReducer from '../Feature/AuthSlices/SignupSlice';
import ChangePasswordReducer from '../Feature/AuthSlices/ChangePasswordSlice';
import UsersReducer from '../Feature/AdminSlices/UsersSlice';
import changeUserTypeSlice from '../Feature/AdminSlices/ChangeTypeSlice';
import userDetailsSlice from '../Feature/AdminSlices/FetchUserByID';
import UpdateUserReducer from '../Feature/AdminSlices/UpdateUserSlice';
export const store = configureStore({
    reducer:{
        authsignup: SignupReducer,
        authlogin: LoginReducer,
        changepass: ChangePasswordReducer,
        user: UsersReducer,
        changeType: changeUserTypeSlice,
        getuserbyid:userDetailsSlice,
        updateuser:UpdateUserReducer

    },
})
