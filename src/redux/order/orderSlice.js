import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ORDER_API } from "../../api";

export const addOrder = createAsyncThunk("cart/addOrder", async (cartItems) => {
  try {
    const orderData = {
      orderDate: new Date().toISOString(),
      items: cartItems.map((item) => ({
        productId: item.id,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
      })),
      totalPrice: cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    };
    const response = await axios.post(ORDER_API, orderData);
    console.log("from slice pass", orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
});

const orderSlice = createSlice({
  name: "order",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(addOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default orderSlice.reducer;
