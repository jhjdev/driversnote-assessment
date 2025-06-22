import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';

// Use this custom hook instead of plain useDispatch to get proper TypeScript typing
export const useAppDispatch = () => useDispatch<AppDispatch>();
