import { configureStore } from '@reduxjs/toolkit';
import counter from './counter';
import alert from './alert';

const store = configureStore({ reducer: { counter, alert } });

export default store;
