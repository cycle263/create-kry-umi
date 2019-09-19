import { getDemoData } from '@/services/demo';

const GlobalModel = {
  namespace: 'global',
  state: {
    demo: {},
  },
  subscriptions: {
    setup({ history, dispatch }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname }) => {
        if (pathname.indexOf('demo') > -1) {
          dispatch({ type: 'getDemo' });
        }
      });
    }
  },
  reducers: {
    demo(state, { payload }) {
      return {
        ...state,
        demo: payload,
      };
    },
  },
  effects: {
    *getDemo({ payload }, { call, put }) {
      // to modify, demo
      const data = yield call(getDemoData, { params: payload });
      yield put({
        type: 'demo',
        payload: data,
      });
    }
  },
};

export default GlobalModel;
