import { request } from "@/utils/request";

export async function getBlindboxConfig() {
  return request({
    method: 'get',
    url: '/api/v1/public/itemData',
    headers: {
      Authorization: localStorage.getItem('kkAuthToken')
    },
  });
}

export async function exchangeBox(data: any) {
  return request({
    method: 'post',
    url: '/api/v1/user/exchangeBox',
    headers: {
      Authorization: localStorage.getItem('kkAuthToken')
    },
    data,
  });
}

export async function openBox(data: any) {
  return request({
    method: 'post',
    url: '/api/v1/user/openBox',
    headers: {
      Authorization: localStorage.getItem('kkAuthToken')
    },
    data
  });
}

export async function getMyBoxList() {
  return request({
    method: 'get',
    url: '/api/v1/user/itemList',
    headers: {
      Authorization: localStorage.getItem('kkAuthToken')
    }
  });
}