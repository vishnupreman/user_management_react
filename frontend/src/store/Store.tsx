import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from '../slices/Authslice'
import adminReducer from '../slices/adminSlice'
import axiosInstance,{setupInterceptors} from '../api/axiosInstance';

export const store = configureStore({
    reducer:{
        auth:AuthReducer,
        admin:adminReducer,
    },
})

setupInterceptors(store.getState, store.dispatch);
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch