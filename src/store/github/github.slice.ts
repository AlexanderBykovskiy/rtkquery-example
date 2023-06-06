import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export const FAVORITE_KEY = 'favoriteKey'

interface IGithubState {
    favorite: string[]
}


const initialState:IGithubState = {
    favorite: JSON.parse(localStorage.getItem(FAVORITE_KEY) ?? '[]'),
}


export const gitlabSlice = createSlice({
    name: 'github',
    initialState,
    reducers: {
        addFavorite(state, action: PayloadAction<string>) {
            state.favorite.push(action.payload)
            localStorage.setItem(FAVORITE_KEY, JSON.stringify(state.favorite))
        },
        removeFavorite(state, action: PayloadAction<string>) {
            state.favorite = state.favorite.filter(item => item !== action.payload)
            localStorage.removeItem(FAVORITE_KEY)
        },
    }
})


export const githubActions = gitlabSlice.actions
export const githubReducer = gitlabSlice.reducer
