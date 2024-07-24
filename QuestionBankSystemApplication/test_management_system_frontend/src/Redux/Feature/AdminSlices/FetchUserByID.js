import { createAsyncThunk , createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

export const fetchUserDetails = createAsyncThunk(
    'users/fetchUserDetails',
    async ({ token, userId }, thunkAPI) => {
        console.log('new slice user id--',userId)
        try {
            const response = await axios.get(`http://127.0.0.1:8000/editusers/${userId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("User details fetched successfully!");
            return response.data;
        } catch (error) {
            if (error.response) {
                toast.error(`Failed to fetch user details: ${error.response.data.detail || error.response.statusText}`);
                return thunkAPI.rejectWithValue(error.response.data);
            } else if (error.request) {
                toast.error("Failed to fetch user details: No response from server");
                return thunkAPI.rejectWithValue({ error: "No response from server" });
            } else {
                toast.error(`Failed to fetch user details: ${error.message}`);
                return thunkAPI.rejectWithValue({ error: error.message });
            }
        }
    }
);

const userDetailsSlice = createSlice({
    name: 'userDetails',
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default userDetailsSlice.reducer;