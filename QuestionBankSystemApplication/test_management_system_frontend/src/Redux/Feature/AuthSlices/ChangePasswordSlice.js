import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const initialState = {
    changePassword: {
        loading: false,
        error: null,
        success: false,
        message: '',
    },
};
const notifySuccess = () => toast.success("Password change Successfully!");
const notifyError = () => toast.error("Check New Password again!");

export const changeUsersPassword = createAsyncThunk(
    'user/changePassword',
    async (credentials, { rejectWithValue }) => {
        console.log("change pass payload ==", credentials)
        const token = localStorage.getItem('token')
        console.log("change pass  token =", token)
        try {
            const response = await axios.post('http://127.0.0.1:8000/changepassword/', credentials, {
                headers: {
                    Authorization: `Bearer ${token}` // Include the token in the request headers
                }
            });
          
            console.log("change password response==", response.data)
            toast.success("Password Changed Successfully"); // Success notification
            localStorage.clear()
            return response.data;
        } catch (error) {

            console.log("change password error response:", error.response.data);
            if (error.response && error.response.data && error.response.data.non_field_errors) {
                const errorMessage = error.response.data.non_field_errors[0];
                if (errorMessage === "Password & Confirm Password not match") {
                  toast.error("Password & Confirm Password not match");
                } else {
                  toast.error(errorMessage);
                }
              } else {
                toast.error("An error occurred. Please try again later.");
              }
            return rejectWithValue(error.message);
        }
    }
);

const changePasswordSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {}, // No reducers needed here (optional slice approach)
    extraReducers: (builder) => {
        builder
            .addCase(changeUsersPassword.pending, (state) => {
                state.changePassword.loading = true;
                state.changePassword.error = null;
                state.changePassword.success = false;
                state.changePassword.message = '';
            })
            .addCase(changeUsersPassword.fulfilled, (state, action) => {
                state.changePassword.loading = false;
                state.changePassword.error = null;
                state.changePassword.success = true;
                state.changePassword.message = action.payload.message;
            })
            .addCase(changeUsersPassword.rejected, (state, action) => {
                state.changePassword.loading = false;
                state.changePassword.error = action.payload || 'Change password failed';
                state.changePassword.success = false;
                state.changePassword.message = '';
            });
    },
});

export default changePasswordSlice.reducer;
