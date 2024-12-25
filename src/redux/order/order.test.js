import { configureStore } from "@reduxjs/toolkit";
import orderReducer,{ addOrder }  from "./orderSlice"; 
import axios from "axios";


jest.mock("axios");

describe("orderSlice", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        order: orderReducer,
      },
    });
  });

  test("should handle addOrder.pending", async () => {
    axios.post.mockResolvedValue({ data: {} });

    const cartItems = [
      { id: 1, productName: "Product 1", price: 10, quantity: 2 },
    ];

    const action = addOrder(cartItems);
    store.dispatch(action);

    const state = store.getState().order;
    expect(state.status).toBe("loading");
  });

  test("should handle addOrder.fulfilled", async () => {
    axios.post.mockResolvedValue({ data: { id: 1, status: "created" } });

    const cartItems = [
      { id: 1, productName: "Product 1", price: 10, quantity: 2 },
    ];

    await store.dispatch(addOrder(cartItems));

    const state = store.getState().order;
    expect(state.status).toBe("succeeded");
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual({ id: 1, status: "created" });
  });

  test("should handle addOrder.rejected", async () => {
    const errorMessage = "Failed to add order";
    axios.post.mockRejectedValue(new Error(errorMessage));

    const cartItems = [
      { id: 1, productName: "Product 1", price: 10, quantity: 2 },
    ];

    try {
      await store.dispatch(addOrder(cartItems));
    } catch (error) {
      const state = store.getState().order;
      expect(state.status).toBe("failed");
      expect(state.error).toBe(errorMessage);
    }
  });
});
