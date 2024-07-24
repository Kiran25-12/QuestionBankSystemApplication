// userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const changeUserRole = createAsyncThunk(
    'user/changeUserRole',
    async ({ id, newRole }, thunkAPI) => {
        console.log("change user type slice id--", id)
        const token = localStorage.getItem('token');
        const response = await axios.put(`http://127.0.0.1:8000/editusers/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("change user type slice response---===",response.data)
        return response.data;
    }
);

const changeUserTypeSlice = createSlice({
    name: 'user',
    initialState: {
        newRole: '',
        loading: false,
        error: null,
    },
    reducers: {
        setNewRole: (state, action) => {
            state.newRole = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(changeUserRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changeUserRole.fulfilled, (state, action) => {
                state.loading = false;
                console.log("extra reducer data----", action.payload)
                state.newRole = action.payload;
            })
            .addCase(changeUserRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { setNewRole } = changeUserTypeSlice.actions;
export default changeUserTypeSlice.reducer;