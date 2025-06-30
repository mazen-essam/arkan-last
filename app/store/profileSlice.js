// store/profileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.get(`${API_URL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          apiKey: "1234",
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.put(`${API_URL}/api/user/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          apiKey: "1234",
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    user: null,
    loading: false,
    error: null,
    updateStatus: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateStatus = "success";
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
