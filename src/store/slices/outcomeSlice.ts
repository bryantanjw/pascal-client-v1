import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";

export interface OutcomeState {
  title: string;
  index: number | null;
}

/**
 * Default state object with initial values.
 */
const initialState: OutcomeState = {
  title: "",
  index: 0,
} as const;

/**
 * Create a slice as a reducer containing actions.
 */
export const outcomeSlice = createSlice({
  name: "outcome",
  initialState,
  reducers: {
    // reducers are functions to mutate the state
    setTitle: (
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState.title>
    ) => {
      state.title = action.payload;
    },
    setIndex: (
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState.index>
    ) => {
      state.index = action.payload;
    },
  },
});

// A small helper of outcome state for `useSelector` function.
export const getOutcomeState = (state: { outcome: OutcomeState }) =>
  state.outcome;

// Exports all actions
export const { setTitle, setIndex } = outcomeSlice.actions;

export default outcomeSlice.reducer;
