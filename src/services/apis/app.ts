import { request } from "@/utils/request";

export async function getAppList() {
  return request({
    method: 'get',
    url: '/api/v1/public/appList'
  });
}

export async function getILEData(projectId: string) {
  return request({
    method: 'get',
    url: '/api/v1/public/ILEData',
    params: {
      projectId: projectId
    }
  });
}


export async function claim(projectId: string, season: number) {
  return request({
    method: 'post',
    url: '/api/v1/ile/getILEReward',
    data: {
      projectId: projectId,
      season: season
    },
    headers: {
      Authorization: localStorage.getItem('kkAuthToken')
    },
  });
}

export async function getILEState(projectId: string, season: number) {
  return request({
    method: 'get',
    url: '/api/v1/ile/checkILERewardState',
    params: {
      projectId: projectId,
      season: season
    },
    headers: {
      Authorization: localStorage.getItem('kkAuthToken')
    },
  });
}