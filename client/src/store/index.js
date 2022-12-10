import { configureStore } from '@reduxjs/toolkit';
import counter from './counter';
import alert from './alert';
import user from './user';
import app from './app';

const store = configureStore({ reducer: { counter, alert, user, app } });

export default store;
