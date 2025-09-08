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
