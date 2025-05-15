import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Async thunks
export const fetchPizzaBases = createAsyncThunk(
  'pizza/fetchBases',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/pizza/bases`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSauces = createAsyncThunk(
  'pizza/fetchSauces',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/pizza/sauces`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCheeses = createAsyncThunk(
  'pizza/fetchCheeses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/pizza/cheeses`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchToppings = createAsyncThunk(
  'pizza/fetchToppings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/pizza/toppings`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createOrder = createAsyncThunk(
  'pizza/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/pizza/order`, orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'pizza/verifyPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/pizza/verify-payment`,
        paymentData
      );
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
  selectedBase: null,
  selectedSauce: null,
  selectedCheese: null,
  selectedToppings: [],
  currentOrder: null,
  loading: false,
  error: null,
};

const pizzaSlice = createSlice({
  name: 'pizza',
  initialState,
  reducers: {
    selectBase: (state, action) => {
      state.selectedBase = action.payload;
    },
    selectSauce: (state, action) => {
      state.selectedSauce = action.payload;
    },
    selectCheese: (state, action) => {
      state.selectedCheese = action.payload;
    },
    toggleTopping: (state, action) => {
      const topping = action.payload;
      const index = state.selectedToppings.findIndex((t) => t._id === topping._id);
      if (index === -1) {
        state.selectedToppings.push(topping);
      } else {
        state.selectedToppings.splice(index, 1);
      }
    },
    clearSelection: (state) => {
      state.selectedBase = null;
      state.selectedSauce = null;
      state.selectedCheese = null;
      state.selectedToppings = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Pizza Bases
      .addCase(fetchPizzaBases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPizzaBases.fulfilled, (state, action) => {
        state.loading = false;
        state.bases = action.payload;
      })
      .addCase(fetchPizzaBases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Fetch Sauces
      .addCase(fetchSauces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSauces.fulfilled, (state, action) => {
        state.loading = false;
        state.sauces = action.payload;
      })
      .addCase(fetchSauces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Fetch Cheeses
      .addCase(fetchCheeses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCheeses.fulfilled, (state, action) => {
        state.loading = false;
        state.cheeses = action.payload;
      })
      .addCase(fetchCheeses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Fetch Toppings
      .addCase(fetchToppings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchToppings.fulfilled, (state, action) => {
        state.loading = false;
        state.toppings = action.payload;
      })
      .addCase(fetchToppings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Verify Payment
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state) => {
        state.loading = false;
        state.currentOrder = null;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const {
  selectBase,
  selectSauce,
  selectCheese,
  toggleTopping,
  clearSelection,
  clearError,
} = pizzaSlice.actions;

export default pizzaSlice.reducer; 