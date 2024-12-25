import { fetchProducts } from "./productSlice";
import axios from "axios";
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";

jest.mock("axios");

describe("productSlice tests", () => {
  describe("fetchProducts async action", () => {
    it("dispatches the fetchProducts action and handles success", async () => {
      const mockResponse = [{ id: 1, name: "Product 1" }];

      axios.get.mockResolvedValueOnce({ data: mockResponse });

      const store = configureStore({ reducer: { products: productReducer } });

      await store.dispatch(fetchProducts());

      const state = store.getState().products;
      expect(state.status).toBe("succeeded");
      expect(state.products).toEqual(mockResponse);
    });

    it("dispatches the fetchProducts action and handles failure", async () => {
      const errorMessage = "Request failed";

      axios.get.mockRejectedValueOnce(new Error(errorMessage));

      const store = configureStore({ reducer: { products: productReducer } });

      await store.dispatch(fetchProducts());

      const state = store.getState().products;
      expect(state.status).toBe("failed");
      expect(state.error).toBe(errorMessage);
    });
  });

  describe("productSlice reducer", () => {
    it("should handle initial state", () => {
      expect(productReducer(undefined, {})).toEqual({
        products: [],
        status: "idle",
        error: null,
      });
    });

    it("should handle fetchProducts.pending", () => {
      const action = { type: fetchProducts.pending.type };
      const initialState = {
        products: [],
        status: "idle",
        error: null,
      };

      expect(productReducer(initialState, action)).toEqual({
        products: [],
        status: "loading",
        error: null,
      });
    });

    it("should handle fetchProducts.fulfilled", () => {
      const action = {
        type: fetchProducts.fulfilled.type,
        payload: [{ id: 1, name: "Product 1" }],
      };
      const initialState = {
        products: [],
        status: "loading",
        error: null,
      };

      expect(productReducer(initialState, action)).toEqual({
        products: [{ id: 1, name: "Product 1" }],
        status: "succeeded",
        error: null,
      });
    });

    it("should handle fetchProducts.rejected", () => {
      const action = {
        type: fetchProducts.rejected.type,
        error: { message: "Error occurred" },
      };
      const initialState = {
        products: [],
        status: "loading",
        error: null,
      };

      expect(productReducer(initialState, action)).toEqual({
        products: [],
        status: "failed",
        error: "Error occurred",
      });
    });
  });
});
