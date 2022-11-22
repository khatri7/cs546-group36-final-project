import { configureStore } from '@reduxjs/toolkit';
import counter from './counter';
import alert from './alert';
import user from './user';

const store = configureStore({ reducer: { counter, alert, user } });

export default store;
