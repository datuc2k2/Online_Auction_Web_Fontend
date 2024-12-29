import { Middleware } from '@reduxjs/toolkit';

const LocalStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  window.addEventListener('beforeunload', () => {
    const state = store.getState();
    const stateToPersist = {
      auth: {
        myInfo: state.auth.myInfo,
      },
    };
    console.log('stateToPersist', stateToPersist);
    localStorage.setItem('reduxState', JSON.stringify(stateToPersist));
  });
  return result;
};

export default LocalStorageMiddleware;
