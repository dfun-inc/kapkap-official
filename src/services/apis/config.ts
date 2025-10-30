import { request } from "@/utils/request";

export async function getConfig() {
  return request({
    method: 'get',
    url: '/api/v1/public/configData'
  });
}

export async function getChainConfig() {
  return request({
    method: 'get',
    url: '/api/v1/public/chainConfig'
  });
}