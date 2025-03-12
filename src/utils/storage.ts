import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'app_state';

interface AppState {
  selectedBackgroundId: number;
  bestScore: number;
}

export const saveState = async (state: AppState) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving state:', error);
  }
};

export const loadState = async (): Promise<AppState | null> => {
  try {
    const savedState = await AsyncStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : null;
  } catch (error) {
    console.error('Error loading state:', error);
    return null;
  }
};