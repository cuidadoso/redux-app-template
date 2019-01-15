import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';

import rootSaga from './saga';
import reducer from './reducer';
import api from './api';
import createBrowserHistory from 'history/createBrowserHistory';

export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();

const enhancer = applyMiddleware(
  routerMiddleware(history),
  api,
  sagaMiddleware,
  logger
);

const store = createStore(
  reducer(history),
  composeWithDevTools(enhancer) // delete composeWithDevTools on prod
);

sagaMiddleware.run(rootSaga);

export default store;
