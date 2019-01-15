import { createSelector } from 'reselect';

/**
 * Constants
 */
export const moduleName = 'router';

/**
 * Selectors
 */
export const stateSelector = (state) => state[moduleName];
export const pathSelector = createSelector(
  stateSelector,
  (state) => state.location.pathname
);

export const pageNameSelector = createSelector(
  pathSelector,
  (state) => state.substr(1)
);
