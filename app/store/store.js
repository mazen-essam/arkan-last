// store.js
import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import propertySlice from "./propertiesSlice"; // Your real property slice
import serviceSlice from "./serviceSlice"; // Your other slices
import apartmentDetailsReducer from "./apartmentDetailsSlice";
import propertyDetailsReducer from "./propertyDetailsSlice"; // Add the new import
import profileReducer from "./profileSlice"; // Import the profile slice
import investmentReducer from "./investmentsSlice"; // Import the investments slice

const makeStore = () =>
  configureStore({
    reducer: {
      service: serviceSlice,
      properties: propertySlice,
      apartmentDetails: apartmentDetailsReducer,
      propertyDetails: propertyDetailsReducer, // Add the new reducer
      profile: profileReducer,
    investments: investmentReducer,
    },
  });

export const wrapper = createWrapper(makeStore);
export const store = makeStore();