import request from '@/utils/request';

export async function getDemoData(params) {
  return request('/api/demo/getData', {
    method: 'POST',
    data: params,
  });
};
