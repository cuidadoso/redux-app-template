import { FAIL, START, SUCCESS } from '../util/constatns';
import { accessTokenSelector } from '../ducks/auth';
import { fetchData } from '../util/FetchUtils';

const PATH_PREFIX = '/v1';

export default (store) => (next) => (action) => {
  const { callApi, method, payload, type, ...rest } = action;
  if (!callApi) return next(action);

  next({
    ...rest,
    type: type + START
  });

  // All requests
  const url = `${PATH_PREFIX}${callApi}`.replace(/^\/+/, '');
  const token = accessTokenSelector(store.getState());
  const init = {
    headers: new Headers({
      Authorization: token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }),
    credentials: 'include',
    method: method || 'GET',
    body: payload ? JSON.stringify({ ...payload }) : null
  };
  fetchData(url, init)
    .then((data) => next({ ...rest, type: type + SUCCESS, data }))
    .catch((error) => next({ ...rest, type: type + FAIL, error }));
};
