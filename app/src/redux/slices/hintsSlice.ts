import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import {urls, herald} from '../urls';

// --- ACTIONS ---


// --- SLICE ---

export interface hint {
  text: string | null,
  type?: 'success' | 'warning' | 'error' | 'info' //| 'casper'
}
export interface hints {
    hints: Array<hint>
}

const initialState: hints = {
  hints: []
}

export const userSlice = createSlice({
  name: 'hint',
  initialState,
  reducers: {
    addHint: (state, action: PayloadAction<hint | string>) => {
        let payload = action.payload;
        if(typeof payload === 'string') payload = {text: payload}
        const hint: hint = {type: 'warning', ...payload }
        console.log(hint.text);
        state.hints = [...state.hints, hint];
    },
    removeLastHint: (state) => {
        state.hints = state.hints.slice(0,-1);
    },
    removeAllHints: (state) => {
        state.hints = [];
    },
  },
})

export const { addHint, removeLastHint, removeAllHints } = userSlice.actions
export default userSlice