import { Subscription } from 'dva';
import { getDemoData } from '@/services/demo';

export interface GlobalModelType {
  namespace: 'global';
  state: {};
  effects: {};
  reducers: {};
  subscriptions: { setup: Subscription };
};

const GlobalModel: GlobalModelType = {
  namespace: 'global',
  state: {
    demo: {},
  },
  subscriptions: {
    setup({ history, dispatch }: any): void {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }: any): void => {
        if (pathname.indexOf('demo') > -1) {
          dispatch({ type: 'getDemo' });
        }
      });
    }
  },
  reducers: {
    demo(state: object, { payload }: any) {
      return {
        ...state,
        demo: payload,
      };
    },
  },
  effects: {
    *getDemo({ payload }: any, { call, put }: any) {
      // to modify, demo
      const data = yield call(getDemoData, { params: payload });
      yield put({
        type: 'demo',
        payload: data,
      });
    },
    *throwError() {
      throw new Error('hi error');
    },
  },
};

export default GlobalModel;
