import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchInvestments = createAsyncThunk(
  "investments/fetchInvestments",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.get(`${API_URL}/api/properties/sale/my`, {
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

const investmentSlice = createSlice({
  name: "investments",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvestments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInvestments.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchInvestments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default investmentSlice.reducer;
