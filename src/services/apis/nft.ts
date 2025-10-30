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