import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import * as config from "../config";
import { APIProvider } from "../types/client/clientTypes";

export const fetchAPIProviders = createAsyncThunk(
  "apiProviders/fetchAPIProviders",
  async () => {
    const res = await fetch(`${config.API_BASE_URL}providers.json`);
    const result = await res.json();

    return result;
  }
);

export type ThunkDispatch = typeof fetchAPIProviders;

export const apiProvidersSlice = createSlice({
  name: "apiProviders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAPIProviders.pending, (state) => {
      state.common.loading = true;
    });
    builder.addCase(fetchAPIProviders.fulfilled, (state, action) => {
      state.common.loading = false;
      state.common.success = true;
      state.common.contents = action.payload as APIProvider;
    });
    builder.addCase(fetchAPIProviders.rejected, (state, action) => {
      state.common.loading = false;
      state.common.error = action.error.message as string;
    });
  },
});

export default apiProvidersSlice.reducer;
