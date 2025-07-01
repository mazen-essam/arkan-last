import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// THUNK
export const fetchApartmentDetails = createAsyncThunk(
  "apartmentDetails/fetchApartmentDetails",
  async (apartmentId, { rejectWithValue }) => {
    console.log("[fetchApartmentDetails] ⏳ Starting request for apartment ID:", apartmentId);
    console.log("[fetchApartmentDetails] 🌐 Using API base URL:", API_BASE_URL);

    try {
      const url = `${API_BASE_URL}/api/properties/${apartmentId}`;
      console.log("[fetchApartmentDetails] 📡 Making GET request to:", url);

      const response = await axios.get(url, {
        headers: {
          apiKey: "1234",
        },
      });
      console.log("[fetchApartmentDetails] ✅ Response received:", {
        status: response.status,
        data: response.data,
        headers: response.headers
      });

      if (!response.data) {
        console.warn("[fetchApartmentDetails] ⚠️ Response data is empty!");
        throw new Error("Empty response data");
      }

      if (!response.data.data) {
        console.warn("[fetchApartmentDetails] ❌ Missing 'data' field in response:", response.data);
        throw new Error("Invalid response structure");
      }

      console.log("[fetchApartmentDetails] 🏠 Apartment fetched successfully:", response.data.data);
      return response.data.data;

    } catch (error) {
      console.error("[fetchApartmentDetails] ❗ Error while fetching apartment details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });

      let errorMessage = error.response?.data?.message || error.message;

      if (error.response?.status === 404) {
        errorMessage = "Apartment not found";
        console.warn("[fetchApartmentDetails] ⚠️ 404 - Apartment not found for ID:", apartmentId);
      }

      return rejectWithValue(errorMessage);
    }
  }
);

// INITIAL STATE
const initialState = {
  apartment: null,
  loading: false,
  error: null,
};

console.log("[apartmentDetailsSlice] 🚀 Initializing slice with:", initialState);

// SLICE
const apartmentDetailsSlice = createSlice({
  name: "apartmentDetails",
  initialState,
  reducers: {
    clearApartmentDetails: (state) => {
      console.log("[clearApartmentDetails] 🧹 Resetting apartment state...");
      state.apartment = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApartmentDetails.pending, (state) => {
        console.log("[fetchApartmentDetails.pending] ⏳ Fetching started");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApartmentDetails.fulfilled, (state, action) => {
        console.log("[fetchApartmentDetails.fulfilled] ✅ Fetch successful:", action.payload);
        state.loading = false;
        state.apartment = action.payload;
      })
      .addCase(fetchApartmentDetails.rejected, (state, action) => {
        console.error("[fetchApartmentDetails.rejected] ❌ Fetch failed:", {
          payload: action.payload,
          error: action.error,
        });
        state.loading = false;
        state.error = action.payload;
      });
  },
});

console.log("[apartmentDetailsSlice] ✅ Slice created successfully");

export const { clearApartmentDetails } = apartmentDetailsSlice.actions;
export default apartmentDetailsSlice.reducer;
