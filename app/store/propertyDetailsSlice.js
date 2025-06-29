// propertyDetailsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPropertyDetails = createAsyncThunk(
  "propertyDetails/fetchPropertyDetails",
  async (propertyId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/properties/${propertyId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const propertyDetailsSlice = createSlice({
  name: "propertyDetails",
  initialState: {
    property: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearPropertyDetails: (state) => {
      state.property = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPropertyDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.property = action.payload;
      })
      .addCase(fetchPropertyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPropertyDetails } = propertyDetailsSlice.actions;
export default propertyDetailsSlice.reducer;