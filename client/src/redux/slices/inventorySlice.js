import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Async thunks
export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/inventory`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateInventoryItem = createAsyncThunk(
  'inventory/updateItem',
  async ({ itemId, itemType, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/inventory/${itemType}/${itemId}`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addInventoryItem = createAsyncThunk(
  'inventory/addItem',
  async ({ itemType, data }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/inventory/${itemType}`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteInventoryItem = createAsyncThunk(
  'inventory/deleteItem',
  async ({ itemId, itemType }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/inventory/${itemType}/${itemId}`);
      return { itemId, itemType };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchInventoryStatistics = createAsyncThunk(
  'inventory/fetchStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/inventory/statistics`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  bases: [],
  sauces: [],
  cheeses: [],
  toppings: [],
  statistics: null,
  loading: false,
  error: null,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Inventory
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.bases = action.payload.bases;
        state.sauces = action.payload.sauces;
        state.cheeses = action.payload.cheeses;
        state.toppings = action.payload.toppings;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Update Inventory Item
      .addCase(updateInventoryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInventoryItem.fulfilled, (state, action) => {
        state.loading = false;
        const { itemType } = action.meta.arg;
        const index = state[itemType].findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) {
          state[itemType][index] = action.payload;
        }
      })
      .addCase(updateInventoryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Add Inventory Item
      .addCase(addInventoryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addInventoryItem.fulfilled, (state, action) => {
        state.loading = false;
        const { itemType } = action.meta.arg;
        state[itemType].push(action.payload);
      })
      .addCase(addInventoryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Delete Inventory Item
      .addCase(deleteInventoryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInventoryItem.fulfilled, (state, action) => {
        state.loading = false;
        const { itemId, itemType } = action.payload;
        state[itemType] = state[itemType].filter((item) => item._id !== itemId);
      })
      .addCase(deleteInventoryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Fetch Inventory Statistics
      .addCase(fetchInventoryStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchInventoryStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearError } = inventorySlice.actions;
export default inventorySlice.reducer; 