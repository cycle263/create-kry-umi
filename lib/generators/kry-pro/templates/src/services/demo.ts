import request from '@/utils/request';

export interface demoParamsType {
  demo1: string,
  demoId: number,
};

export async function getDemoData(params: demoParamsType) {
  return request('/api/demo/getData', {
    method: 'POST',
    data: params,
  });
};
