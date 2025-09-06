import { request } from "@/utils/request";

export async function evmLogin(data: any) {
  return request({
    method: 'post',
    url: '/api/v1/walletLogin/evmLogin',
    data
  });
}

export async function tgLogin(data: any) {
  return request({
    method: 'post',
    url: '/tgWebLogin',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    data
  });
}

export async function getUserInfo() {
  return request({
    method: 'post',
    url: '/userInfo',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    data: {
      'token': localStorage.getItem('gkAuthToken')
    }
  });
}

export async function getReferrerInfo() {
  return request({
    method: 'post',
    url: '/referrerInfo',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    data: {
      'token': localStorage.getItem('gkAuthToken')
    }
  });
}

export async function getReferrerHistory() {
  return request({
    method: 'post',
    url: '/referrerHistory',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    data: {
      'token': localStorage.getItem('gkAuthToken')
    }
  });
}