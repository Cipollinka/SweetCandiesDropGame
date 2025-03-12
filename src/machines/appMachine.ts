import {createMachine, assign, log} from 'xstate';

export const appMachine = createMachine({
  id: 'app',
  initial: 'idle',
  context: {
    selectedBackgroundId: 0,
    bestScore: 0,
  },
  states: {
    idle: {
      on: {
        SELECT_BACKGROUND: {
          actions: assign({
            selectedBackgroundId: ({event}) => event.selectedBackgroundId || 0,
          }),
        },
        UPDATE_BEST_SCORE: {
          actions: assign({
            bestScore: ({context, event}) => {
              return event.score > context.bestScore
                ? event.score
                : context.bestScore;
            },
          }),
        },
      },
    },
  },
});
