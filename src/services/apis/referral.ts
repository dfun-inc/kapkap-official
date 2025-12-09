import { request } from "@/utils/request";

export async function getReferralCode() {
  return request({
    method: 'get',
    url: '/api/v1/user/referralCode',
    headers: {
      Authorization: localStorage.getItem('kkAuthToken')
    },
  });
}

export async function getRefeeealInfo() {
  return request({
    method: 'get',
    url: '/api/v1/user/getReferrerInfo',
    headers: {
      Authorization: localStorage.getItem('kkAuthToken')
    },
  });
}

export async function getReferralHistory() {
  return request({
    method: 'get',
    url: '/api/v1/user/getReferrerHistory',
    headers: {
      Authorization: localStorage.getItem('kkAuthToken')
    },
  });
}

export async function getRankInfo() {
  return request({
    method: 'get',
    url: '/api/v1/public/getRankInfo'
  });
}

export async function claimReward() {
  return request({
    method: 'get',
    url: '/api/v1/user/getReferrerReward',
    headers: {
      Authorization: localStorage.getItem('kkAuthToken')
    },
  });
}