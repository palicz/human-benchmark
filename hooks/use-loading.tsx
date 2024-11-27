"use client";

import { create } from 'zustand';

type LoadingStore = {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

export const useLoading = create<LoadingStore>((set) => ({
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));