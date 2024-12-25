import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CART_API } from "../../api";
import toast from "react-hot-toast";

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  try {
    const response = await axios.get(`${CART_API}`);
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const addToCart = createAsyncThunk("cart/addToCart", async (product) => {
  try {
    const response = await axios.post(`${CART_API}`, product);
    toast.success("Item add to the cart!");
    return response.data;
  } catch (error) {
    toast.error("Failed to add to cart!");
    throw error;
  }
});

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ cartItemId, newQuantity }) => {
    try {
      const response = await axios.put(
        `${CART_API}/update-quantity/${cartItemId}?newQuantity=${newQuantity}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (id) => {
    try {
      const response = await axios.delete(`${CART_API}/${id}`);
      toast.error("Item deleted from cart");
      return response.data;
    } catch (error) {
      toast.error("Failed to remove item from the cart");
      throw error;
    }
  }
);


const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateQuantity.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedItem = action.payload;
        // console.log('Updated Item:', updatedItem);
        const index = state.items.findIndex(
          (item) => item.productId === updatedItem.productId
        );
        if (index !== -1) {
          state.items[index] = updatedItem;
        } else {
          state.items.push(updatedItem);
        }
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter(
          (item) => item.productId !== action.payload.productId
        );
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default cartSlice.reducer;
