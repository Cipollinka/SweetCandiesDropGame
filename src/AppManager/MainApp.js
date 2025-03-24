import AppNavigator from '@/AppNavigator';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import { AppMachineContext } from 'App';

function App() {
  return (
    <SafeAreaProvider>
      <AppMachineContext.Provider>
        <AppNavigator />
      </AppMachineContext.Provider>
    </SafeAreaProvider>
  );
}

export default App;
