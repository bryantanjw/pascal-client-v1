import { configureStore } from "@reduxjs/toolkit";
import outcomeReducer from "./slices/outcomeSlice";
import orderbookReducer from "./slices/orderbookSlice";
import {
  useDispatch as useDispatchBase,
  useSelector as useSelectorBase,
} from "react-redux";

/**
 * Creates a store and includes all the slices as reducers.
 */
export const store = configureStore({
  reducer: {
    outcome: outcomeReducer,
    orderbook: orderbookReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: { users: UsersState}
type AppDispatch = typeof store.dispatch;

// Since we use typescript, lets utilize `useDispatch`
export const useDispatch = () => useDispatchBase<AppDispatch>();

// And utilize `useSelector`
export const useSelector = <TSelected = unknown>(
  selector: (state: RootState) => TSelected
): TSelected => useSelectorBase<RootState, TSelected>(selector);
