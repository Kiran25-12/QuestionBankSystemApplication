import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const initialState = {
    users: [],
    loading: false,
    error: null,
    selectedUser: null,
};

// to fecth all users
export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (token, thunkAPI) => {
        // console.log("admin token ===", token)
        try {
            const response = await axios.get(`http://127.0.0.1:8000/userslistforadmin/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // console.log("admin get all users list====", response.data);
            // toast.success("Users fetched successfully!");
            return response.data;
        } catch (error) {
            toast.error("Failed to fetch users");
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);


// export const fetchUsers = createAsyncThunk(
//     'users/fetchUsers',
//     async (token, thunkAPI) => {
//         console.log("admin token ===", token);
//         try {
//             console.log("Attempting to fetch users...");
//             const response = await axios.get(`http://127.0.0.1:8000/userslistforadmin/`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             console.log("users list====", response.data);
//             toast.success("Users fetched successfully!");
//             return response.data;
//         } catch (error) {
//             if (error.response) {
//                 // The request was made and the server responded with a status code
//                 // that falls out of the range of 2xx
//                 console.error("Server responded with an error:", error.response.data);
//                 toast.error(`Failed to fetch users: ${error.response.data.detail || error.response.statusText}`);
//                 return thunkAPI.rejectWithValue(error.response.data);
//             } else if (error.request) {
//                 // The request was made but no response was received
//                 console.error("No response received from server:", error.request);
//                 toast.error("Failed to fetch users: No response from server");
//                 return thunkAPI.rejectWithValue({ error: "No response from server" });
//             } else {
//                 // Something happened in setting up the request that triggered an Error
//                 console.error("Error setting up request:", error.message);
//                 toast.error(`Failed to fetch users: ${error.message}`);
//                 return thunkAPI.rejectWithValue({ error: error.message });
//             }
//         }
//     }
// );


// slices
const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                // console.log("**************",action.payload)
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            
            
    },
});

export const selectUsers = (state) => state.users.users;
export const selectLoading = (state) => state.users.loading;
export const selectError = (state) => state.users.error;

export default usersSlice.reducer;