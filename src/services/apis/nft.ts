import { request } from "@/utils/request";

export async function getNFTData() {
  return request({
    method: 'get',
    url: '/api/v1/public/NFTData'
  });
}

export async function getMintData(data:any) {
  return request({
    method: 'post',
    url: '/api/v1/nft/mint',
    data,
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

export async function getRemintList() {
  return request({
    method: 'get',
    url: '/api/v1/nft/getReMintIdList',
    headers: {
      Authorization: localStorage.getItem('kkAuthToken')
    },
  });
}

export async function getRemintData(data:any) {
  return request({
    method: 'post',
    url: '/api/v1/nft/remint',
    data,
    headers: {
      Authorization: localStorage.getItem('kkAuthToken')
    },
  });
}
