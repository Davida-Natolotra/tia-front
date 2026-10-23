import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices
import motoReducer from './slices/moto';
import caisseMotoReducer from './slices/caisse';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: []
};

const rootReducer = combineReducers({
  motos: motoReducer,
  caisseMoto: caisseMotoReducer
});

export { rootPersistConfig, rootReducer };
