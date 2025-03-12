import {createMachine, assign} from 'xstate';

interface CandyContext {
  count: number;
}

type CandyEvents = {type: 'INCREMENT'} | {type: 'RESET'};

export const candyMachine = createMachine({
  id: 'candy',
  initial: 'idle',
  context: {
    count: 0,
  },
  states: {
    idle: {
      on: {
        INCREMENT: {
          actions: assign({
            count: context => context.context.count + 1,
          }),
        },
        RESET: {
          actions: assign({
            count: () => 0,
          }),
        },
      },
    },
  },
});
