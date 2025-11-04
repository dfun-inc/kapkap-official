import { request } from "@/utils/request";

export async function evmLogin(data: any) {
  return request({
    method: 'post',
    url: '/api/v1/evmLogin',
    data
  });
}

export async function tgLogin(data: any) {
  return request({
    method: 'post',
    url: '/api/v1/tgLogin',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    data
  });
}

export async function getUserInfo() {
  return request({
    method: 'get',
    url: '/api/v1/user/getUserInfo',
    headers: {
      Authorization: localStorage.getItem('kkAuthToken')
    },
  });
}

export async function bindEvmAccount(data:any) {
  return request({
    method: 'post',
    url: '/api/v1/user/bindEvmAccount',
    data,
    headers: {
      Authorization: localStorage.getItem('kkAuthToken')
    },
  });
}

export async function bindTgAccount(bindToken: string) {
  return request({
    method: 'post',
    url: '/api/v1/user/bindTgAccount',
    data: {
      bindToken
    },
    headers: {
      Authorization: localStorage.getItem('kkAuthToken')
    },
  });
}

export async function bindTonAccount(address: string) {
  return request({
    method: 'post',
    url: '/api/v1/user/bindTonWallet',
    data: {
      address
    },
    headers: {
      Authorization: localStorage.getItem('kkAuthToken')
    },
  });
}

export async function submitMsg(data:any) {
  return request({
    method: 'post',
    url: '/api/v1/user/submitMsg',
    data,
    headers: {
      Authorization: localStorage.getItem('kkAuthToken')
    },
  });
}

export async function getKScore(projectId: number) {
  return request({
    method: 'get',
    url: '/api/v1/user/getKScore',
    params: {
      projectId
    },
    headers: {
      Authorization: localStorage.getItem('kkAuthToken')
    },
  });
}

export async function getKScoreHistory() {
  return request({
    method: 'get',
    url: '/api/v1/user/getKScoreHistory',
    headers: {
      Authorization: localStorage.getItem('kkAuthToken')
    },
  });
}

export async function getMintHistory() {
  return request({
    method: 'get',
    url: '/api/v1/nft/getMint1155History',
    headers: {
      Authorization: localStorage.getItem('kkAuthToken')
    },
  });
}
