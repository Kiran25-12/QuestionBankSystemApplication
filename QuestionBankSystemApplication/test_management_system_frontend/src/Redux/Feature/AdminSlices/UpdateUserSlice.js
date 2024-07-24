import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

export const updateUser = createAsyncThunk(
    'users/updateUser',
    async ({token, userId, userData} , thunkAPI) => {
        console.log('id---', userId.id)
        const id = userId.id
        try {
            const response = await axios.put(`http://127.0.0.1:8000/editusers/${id}/`, userData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("User details updated successfully!");
            return response.data;
        } catch (error) {
            if (error.response) {
                toast.error(`Failed to update user details: ${error.response.data.detail || error.response.statusText}`);
                return thunkAPI.rejectWithValue(error.response.data);
            } else if (error.request) {
                toast.error("Failed to update user details: No response from server");
                return thunkAPI.rejectWithValue({ error: "No response from server" });
            } else {
                toast.error(`Failed to update user details: ${error.message}`);
                return thunkAPI.rejectWithValue({ error: error.message });
            }
        }
    }
);

const updateUserSlice = createSlice({
    name: 'updateUser',
    initialState: {
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default updateUserSlice.reducer;