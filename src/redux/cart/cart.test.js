import { configureStore } from "@reduxjs/toolkit";
import cartReducer, {
  fetchCart,
  addToCart,
  updateQuantity,
  removeFromCart,
} from "./cartSlice";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios;

describe("cartSlice", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        cart: cartReducer,
      },
    });
  });

  test("should handle initial state", () => {
    const initialState = store.getState().cart;
    expect(initialState.status).toBe("idle");
    expect(initialState.items).toEqual([]);
    expect(initialState.error).toBeNull();
  });

  test("should fetch cart items successfully", async () => {
    const cartData = [{ productId: 1, name: "Product 1" }];
    mockedAxios.get.mockResolvedValueOnce({ data: cartData });

    await store.dispatch(fetchCart());

    const state = store.getState().cart;
    expect(state.status).toBe("succeeded");
    expect(state.items).toEqual(cartData);
  });

  test("should handle fetchCart failure", async () => {
    const errorMessage = "Error fetching cart data";
    mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

    await store.dispatch(fetchCart());

    const state = store.getState().cart;
    expect(state.status).toBe("failed");
    expect(state.error).toBe(errorMessage);
  });

  test("should add item to cart successfully", async () => {
    const newProduct = { productId: 2, name: "Product 2" };
    mockedAxios.post.mockResolvedValueOnce({ data: newProduct });

    await store.dispatch(addToCart(newProduct));

    const state = store.getState().cart;
    expect(state.status).toBe("succeeded");
    expect(state.items).toContainEqual(newProduct);
  });

  test("should handle addToCart failure", async () => {
    const errorMessage = "Failed to add to cart";
    mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

    await store.dispatch(addToCart({ productId: 3, name: "Product 3" }));

    const state = store.getState().cart;
    expect(state.status).toBe("failed");
    expect(state.error).toBe(errorMessage);
  });

  test("should update item quantity successfully", async () => {
    const updatedItem = { productId: 1, name: "Product 1", quantity: 3 };
    mockedAxios.put.mockResolvedValueOnce({ data: updatedItem });

    await store.dispatch(updateQuantity({ cartItemId: 1, newQuantity: 3 }));

    const state = store.getState().cart;
    expect(state.status).toBe("succeeded");
    expect(state.items).toContainEqual(updatedItem);
  });

  test("should handle updateQuantity failure", async () => {
    const errorMessage = "Failed to update quantity";
    mockedAxios.put.mockRejectedValueOnce(new Error(errorMessage));

    await store.dispatch(updateQuantity({ cartItemId: 1, newQuantity: 3 }));

    const state = store.getState().cart;
    expect(state.status).toBe("failed");
    expect(state.error).toBe(errorMessage);
  });

  test("should remove item from cart successfully", async () => {
    const itemToRemove = { productId: 1, name: "Product 1" };
    mockedAxios.delete.mockResolvedValueOnce({ data: itemToRemove });

    await store.dispatch(removeFromCart(1));

    const state = store.getState().cart;
    expect(state.status).toBe("succeeded");
    expect(state.items).not.toContainEqual(itemToRemove);
  });

  test("should handle removeFromCart failure", async () => {
    const errorMessage = "Failed to remove item from cart";
    mockedAxios.delete.mockRejectedValueOnce(new Error(errorMessage));

    await store.dispatch(removeFromCart(1));

    const state = store.getState().cart;
    expect(state.status).toBe("failed");
    expect(state.error).toBe(errorMessage);
  });
});
