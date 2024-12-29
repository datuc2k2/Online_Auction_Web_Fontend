import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './RootReducer';
import rootSaga from './Sagas';
import LocalStorageMiddleware from './localStorageMiddleware';

const sagaMiddleware = createSagaMiddleware();

const persistedState = typeof window !== "undefined" && localStorage.getItem('reduxState') 
    ? JSON.parse(localStorage.getItem('reduxState')!)
    : {};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
      thunk: true,
    }).concat(sagaMiddleware, LocalStorageMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: persistedState,
  enhancers: (getDefaultEnhancers) => getDefaultEnhancers(),
});

sagaMiddleware.run(rootSaga);

export default store;
