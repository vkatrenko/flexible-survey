import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

import userAnswersReducer from './features/userAnswers/userAnswersSlice';

const store = configureStore({
  reducer: {
    userAnswers: userAnswersReducer,
  },
  devTools: process.env.NODE_ENV !== 'production', // Вмикаємо DevTools тільки в режимі розробки
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
