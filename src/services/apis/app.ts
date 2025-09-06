import { request } from "@/utils/request";

export async function getAppList() {
  return request({
    method: 'get',
    url: '/api/v1/public/appList'
  });
}