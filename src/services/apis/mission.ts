import { request } from "@/utils/request";

export async function getMissionConfig(projectId: string) {
  return request({
    method: 'get',
    url: '/api/v1/mission/missionConfig',
    params: {
      projectId: projectId
    },
    headers: {
      Authorization: localStorage.getItem('kkAuthToken')
    },
  });
}

export async function getMissionProcess(projectId: string, playerId: string) {
  return request({
    method: 'get',
    url: '/api/v1/mission/missionData',
    params: {
      projectId: projectId,
      playerId: playerId
    },
    headers: {
      Authorization: localStorage.getItem('kkAuthToken')
    },
  });
}

export async function checkMissionProcess(projectId: string, missionId: string) {
  return request({
    method: 'post',
    url: '/api/v1/mission/checkMissionState',
    data: {
      projectId: projectId,
      missionId: missionId
    },
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
      bindToken: bindToken
    },
    headers: {
      Authorization: localStorage.getItem('kkAuthToken')
    },
  });
}