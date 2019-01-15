import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as form } from 'redux-form';

import authReducer, { moduleName as authModule } from '../ducks/auth';
import windowReducer, { moduleName as windowModule } from '../ducks/window';

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    form,
    // add reducers here
    [authModule]: authReducer,
    [windowModule]: windowReducer
  });
