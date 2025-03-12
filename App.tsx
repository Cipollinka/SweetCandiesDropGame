import AppNavigator from '@/AppNavigator';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import './global.css';
import {createActorContext} from '@xstate/react';
import {appMachine} from '@/machines/appMachine';

export const AppMachineContext = createActorContext(appMachine);

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <AppMachineContext.Provider>
        <AppNavigator />
      </AppMachineContext.Provider>
    </SafeAreaProvider>
  );
}

export default App;
