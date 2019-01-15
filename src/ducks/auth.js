import { Record } from 'immutable';
import { all, takeEvery } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import { appName } from '../util/constatns';

/**
 * Constants
 */
export const moduleName = 'auth';
export const LOG_OUT = `${appName}/${moduleName}/LOG_OUT`;
export const AUTH_DATA_UPDATE = `${appName}/${moduleName}/AUTH_DATA_UPDATE`;

const logout = () => {
  console.log('---', 'Log out function');
};

/**
 * Reducer
 */
const ReducerRecord = Record({
  id: null,
  login: null,
  email: null,
  name: null,
  accessToken: null,
  roles: [],
  error: null,
  loading: false
});

// auth reducer
export default function reducer(state = new ReducerRecord(), action) {
  const { type, payload, error } = action;

  switch (type) {
    case AUTH_DATA_UPDATE:
      return state
        .set('roles', payload.roles)
        .set('loading', false)
        .set('id', payload.id)
        .set('login', payload.login)
        .set('email', payload.email)
        .set('name', payload.name)
        .set('accessToken', payload.accessToken)
        .set('error', error);
    case LOG_OUT:
      return new ReducerRecord();
    default:
      return state;
  }
}

/**
 * Selectors
 */
export const stateSelector = (state) => state[moduleName];
export const loadingSelector = createSelector(
  stateSelector,
  (state) => state.loading
);
export const idSelector = createSelector(
  stateSelector,
  (state) => state.id
);
export const loginSelector = createSelector(
  stateSelector,
  (state) => state.login
);
export const emailSelector = createSelector(
  stateSelector,
  (state) => state.email
);
export const nameSelector = createSelector(
  stateSelector,
  (state) => state.name
);
export const accessTokenSelector = createSelector(
  stateSelector,
  (state) => 'Bearer ' + state.accessToken
);
export const rolesSelector = createSelector(
  stateSelector,
  (state) => state.roles
);
export const errorSelector = createSelector(
  stateSelector,
  (state) => state.error
);

/**
 * Action creators
 */
export function signOut() {
  return {
    type: LOG_OUT
  };
}

export function updateAuth(authData) {
  return {
    type: AUTH_DATA_UPDATE,
    payload: authData
  };
}
/**
 * Sagas
 */
export const logoutSaga = function*() {
  yield logout();
};

export const saga = function*() {
  yield all([takeEvery(LOG_OUT, logoutSaga)]);
};
