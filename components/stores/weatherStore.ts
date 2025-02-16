import { create } from 'zustand'

interface WeatherStore {
    showWeatherUI: boolean;
    setShowWeatherUI: (showWeatherUI: boolean) => void;
}

export const useWeatherStore = create<WeatherStore>((set) => ({
    showWeatherUI: true,
    setShowWeatherUI: (showWeatherUI) => set((state) => ({ showWeatherUI })),
  }))