import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  // Add more screens here as needed
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Helper hook types
export type UseNavigationType = RootStackNavigationProp;