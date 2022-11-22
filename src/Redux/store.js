import { configureStore } from '@reduxjs/toolkit'
import listSlice from './Slices/listSlice.js'


export const store = configureStore({
    reducer: {
        listSlice,
    },
})
