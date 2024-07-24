import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const initialState = {
    createUser: {
        loading: false,
        error: null,
        success: false,
    },
};
const notifySuccess = () => toast.success("Register Successfully!");
const notifyError = () => toast.error("Please Check Credentials!");

export const createUser = createAsyncThunk(
    'user/createUser',
    async (userData, { rejectWithValue }) => {
        console.log(userData)
        try {
            const response = await axios.post('http://127.0.0.1:8000/register/', userData);
            notifySuccess();
            return response.data; // Assuming success response data structure
        } catch (error) {
            notifyError();
            return rejectWithValue(error.message); // Handle errors appropriately
        }
    }
);


const SignupSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetCreateUserState(state) {
            state.createUser = initialState.createUser;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createUser.pending, (state) => {
                state.createUser.loading = true;
                state.createUser.error = null;
                state.createUser.success = false;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.createUser.loading = false;
                state.createUser.error = null;
                state.createUser.success = true;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.createUser.loading = false;
                state.createUser.error = action.payload || 'Create user failed';
                state.createUser.success = false;
            });
    },

})

export default SignupSlice.reducer;
export const { resetCreateUserState } = SignupSlice.actions;