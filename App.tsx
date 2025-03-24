import React from 'react';
import './global.css';
import {createActorContext} from '@xstate/react';
import {appMachine} from '@/machines/appMachine';
import AppManager from '@/AppManager/AppManager';

export const AppMachineContext = createActorContext(appMachine);

function App(): React.JSX.Element {
  return (
    <AppManager />
  );
}

export default App;
