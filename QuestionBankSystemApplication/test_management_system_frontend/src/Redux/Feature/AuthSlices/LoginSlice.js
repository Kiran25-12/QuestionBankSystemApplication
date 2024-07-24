import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const initialState = {
    login: {
      loading: false,
      error: null,
      success: false,
      userData: null,
    },
  };
  const notifySuccess = () => toast.success("Login Successfully");
  const notifyError = () => toast.error("Please Check Credentials!");

  export const login = createAsyncThunk(
    'user/login',
    async (credentials, { rejectWithValue }) => {
      console.log("login credentials=", credentials)
      try {
        const response = await axios.post('http://127.0.0.1:8000/login/', credentials);
        notifySuccess();
        return response.data; // Assuming success response data structure
      } catch (error) {
        notifyError();
        return rejectWithValue(error.message); // Handle errors appropriately
      } 
    }
  );

  const loginSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      resetLoginState(state) {
        state.login = initialState.login;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(login.pending, (state) => {
          state.login.loading = true;
          state.login.error = null;
          state.login.success = false;
        })
        .addCase(login.fulfilled, (state, action) => {
          state.login.loading = false;
          state.login.error = null;
          state.login.success = true;
          state.login.userData = action.payload;
        })
        .addCase(login.rejected, (state, action) => {
          state.login.loading = false;
          state.login.error = action.payload || 'Login failed';
          state.login.success = false;
        });
    },
  });
  
  export const { resetLoginState } = loginSlice.actions;
  export default loginSlice.reducer;
  