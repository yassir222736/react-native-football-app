import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VideoItem } from "../../navigation/types";

const initialState: VideoItem[] = [];

const favoritesSlice = createSlice({
    initialState: initialState,
    name: "favorites",
    reducers: {
        addFavorite: (state, action: PayloadAction<VideoItem>) => {
            const isInState = state.some(video => video.id === action.payload.id);
            if (!isInState) {
                return [...state, action.payload];
            }
            return state;
        },
        removeFavorite: (state, action: PayloadAction<string>) => {
            return state.filter(video => video.id !== action.payload);
        },
        clearAllFavorites: (state, action) => {
            return initialState;
        }
    }
});

export const { reducer, actions: { addFavorite, removeFavorite, clearAllFavorites } } = favoritesSlice;