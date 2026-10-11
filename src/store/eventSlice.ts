import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Event } from "@/types/event";

type EventsState = {
  events: Event[];
};

const initialState: EventsState = {
  events: [],
};

const eventSlice = createSlice({
  name: "eventSlice",
  initialState,
  reducers: {
    createEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    },
    clearEvents: (state) => {
      state.events = [];
    },
  },
});

export const { createEvent, clearEvents } = eventSlice.actions;
export default eventSlice.reducer;
