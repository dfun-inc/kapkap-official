import { request } from "@/utils/request";

export async function getNFTData() {
  return request({
    method: 'get',
    url: '/api/v1/public/NFTData'
  });
}

export async function getNFT1155Data() {
  return request({
    method: 'get',
    url: '/api/v1/public/NFT1155Data'
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

export async function getEvmMint1155History() {
  return request({
    method: 'get',
    url: '/api/v1/nft/getMint1155History',
    headers: {
      Authorization: localStorage.getItem('kkAuthToken')
    },
  });
}

export async function getEvmMint721History() {
  return request({
    method: 'get',
    url: '/api/v1/nft/getEvmMint721History',
    headers: {
      Authorization: localStorage.getItem('kkAuthToken')
    },
  });
}

export async function getTonMint721History() {
  return request({
    method: 'get',
    url: '/api/v1/nft/getTonMint721History',
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


export async function mintTonNFT(data:any) {
  return request({
    method: 'post',
    url: '/api/v1/nft/mintTonNft',
    data,
    headers: {
      Authorization: localStorage.getItem('kkAuthToken')
    },
  });
}


export async function mappingBscChain(data:any) {
  return request({
    method: 'post',
    url: '/api/v1/nft/mappingEvm721',
    data,
    headers: {
      Authorization: localStorage.getItem('kkAuthToken')
    },
  });
}

export async function mappingEvm1155(data:any) {
  return request({
    method: 'post',
    url: '/api/v1/nft/mappingEvm1155',
    data,
    headers: {
      Authorization: localStorage.getItem('kkAuthToken')
    },
  });
}