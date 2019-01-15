import { Record } from 'immutable';
import { createSelector } from 'reselect';

import { appName } from '../util/constatns';

/**
 * Constants
 */
export const moduleName = 'window';
export const RESIZE_WINDOW = `${appName}/${moduleName}/RESIZE_WINDOW`;

/**
 * Reducer
 */
const ReducerRecord = Record({
  width: null,
  height: null
});

// auth reducer
export default function reducer(state = new ReducerRecord(), action) {
  const { type, payload } = action;

  switch (type) {
    case RESIZE_WINDOW:
      const { innerWidth, innerHeight } = payload;
      const height = innerHeight < 830 ? 830 : innerHeight;
      return state.set('width', innerWidth).set('height', height);
    default:
      return state;
  }
}

/**
 * Selectors
 */
export const stateSelector = (state) => state[moduleName];
export const widthSelector = createSelector(
  stateSelector,
  (state) => state.width
);
export const heightSelector = createSelector(
  stateSelector,
  (state) => state.height
);

export const tableHeightSelector = createSelector(
  heightSelector,
  (state) => calcFullTableHeight(state)
);

/**
 * Вычислить высоту таблицы как размер окна минус высота заголовка
 * @returns {number}
 */
function calcFullTableHeight(height) {
  const HEADER_SIZE = 185; // Размер "всей шапки"
  return height > HEADER_SIZE ? height - HEADER_SIZE : 0;
}

/**
 * Action creators
 */
export function resize(window) {
  return {
    type: RESIZE_WINDOW,
    payload: window
  };
}
