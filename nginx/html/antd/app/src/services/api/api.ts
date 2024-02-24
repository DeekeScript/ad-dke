// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

export async function editPassword(body?: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/editPassword', {
    method: 'POST',
    ...(options || {}),
    data: body,
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/login/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function agentList(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/agentList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function updateAgent(body: any, options?: { [key: string]: any }) {
  return request('/api/updateAgent', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function addAgent(body: any, options?: { [key: string]: any }) {
  return request('/api/addAgent', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function removeAgent(params: any, options?: { [key: string]: any }) {
  return request('/api/removeAgent', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function machineList(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/machineList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function updateMachine(body: any, options?: { [key: string]: any }) {
  return request('/api/updateMachine', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function addMachine(body: any, options?: { [key: string]: any }) {
  return request('/api/addMachine', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function removeMachine(params: any, options?: { [key: string]: any }) {
  return request('/api/removeMachine', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function videoList(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/videoList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function removeVideo(params: any, options?: { [key: string]: any }) {
  return request('/api/removeVideo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function videoDetailList(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/videoDetailList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function removeVideoDetail(params: any, options?: { [key: string]: any }) {
  return request('/api/removeVideoDetail', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function videoCommentList(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/videoCommentList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function removeVideoComment(params: any, options?: { [key: string]: any }) {
  return request('/api/removeVideoComment', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function videoDouyinList(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/videoDouyinList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function updateVideoDouyin(body: any, options?: { [key: string]: any }) {
  return request('/api/updateVideoDouyin', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function addVideoDouyin(body: any, options?: { [key: string]: any }) {
  return request('/api/addVideoDouyin', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function removeVideoDouyin(params: any, options?: { [key: string]: any }) {
  return request('/api/removeVideoDouyin', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function speechList(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/speechList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function updateSpeech(body: any, options?: { [key: string]: any }) {
  return request('/api/updateSpeech', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function addSpeech(body: any, options?: { [key: string]: any }) {
  return request('/api/addSpeech', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function removeSpeech(params: any, options?: { [key: string]: any }) {
  return request('/api/removeSpeech', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function autoSpeechList(params: any, options?: { [key: string]: any }) {
  return request('/api/autoSpeechList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getSpeechLib(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/getSpeechLib', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function speechLibList(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/speechLibList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function updateSpeechLib(body: any, options?: { [key: string]: any }) {
  return request('/api/updateSpeechLib', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function addSpeechLib(body: any, options?: { [key: string]: any }) {
  return request('/api/addSpeechLib', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function removeSpeechLib(params: any, options?: { [key: string]: any }) {
  return request('/api/removeSpeechLib', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function taskList(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/taskList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function updateTask(body: any, options?: { [key: string]: any }) {
  return request('/api/updateTask', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function addTask(body: any, options?: { [key: string]: any }) {
  return request('/api/addTask', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function removeTask(params: any, options?: { [key: string]: any }) {
  return request('/api/removeTask', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

//getUserRules
export async function getUserRules(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/getUserRules', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getCommentRules(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/getCommentRules', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getVideoRules(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/getVideoRules', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function videoRuleList(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/videoRuleList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function updateVideoRule(body: any, options?: { [key: string]: any }) {
  return request('/api/updateVideoRule', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function addVideoRule(body: any, options?: { [key: string]: any }) {
  return request('/api/addVideoRule', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function removeVideoRule(params: any, options?: { [key: string]: any }) {
  return request('/api/removeVideoRule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function commentRuleList(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/commentRuleList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getProvince(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/getProvince', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function updateCommentRule(body: any, options?: { [key: string]: any }) {
  return request('/api/updateCommentRule', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function addCommentRule(body: any, options?: { [key: string]: any }) {
  return request('/api/addCommentRule', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function removeCommentRule(params: any, options?: { [key: string]: any }) {
  return request('/api/removeCommentRule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function removeUserRule(params: any, options?: { [key: string]: any }) {
  return request('/api/removeUserRule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function userRuleList(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/userRuleList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function updateUserRule(body: any, options?: { [key: string]: any }) {
  return request('/api/updateUserRule', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function addUserRule(body: any, options?: { [key: string]: any }) {
  return request('/api/addUserRule', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function statistic(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/statistic', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function statisticList(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/statisticList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function removeStatistic(params: any, options?: { [key: string]: any }) {
  return request('/api/removeStatistic', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function userList(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/userList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function updateUser(body: any, options?: { [key: string]: any }) {
  return request('/api/updateUser', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function addUser(body: any, options?: { [key: string]: any }) {
  return request('/api/addUser', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function removeUser(params: any, options?: { [key: string]: any }) {
  return request('/api/removeUser', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getMachine(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/getMachine', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function logList(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/logList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function removeLog(params: any, options?: { [key: string]: any }) {
  return request('/api/removeLog', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function apkList(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/apkList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getCosSign(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/getCosSign', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function addApk(body: any, options?: { [key: string]: any }) {
  return request('/api/addApk', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function grabTaskList(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/grabTaskList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getGrabTaskSetting(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/getGrabTaskSetting', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function grabTaskSetting(body: any, options?: { [key: string]: any }) {
  return request('/api/grabTaskSetting', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function addGrabTask(body: any, options?: { [key: string]: any }) {
  return request('/api/addGrabTask', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function updateGrabTask(body: any, options?: { [key: string]: any }) {
  return request('/api/updateGrabTask', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function removeGrabTask(params: any, options?: { [key: string]: any }) {
  return request('/api/removeGrabTask', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function removeGrabTaskList(params: any, options?: { [key: string]: any }) {
  return request('/api/removeGrabTaskList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}


export async function grabTaskPhoneList(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/grabTaskPhoneList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function removeGrabTaskPhone(params: any, options?: { [key: string]: any }) {
  return request('/api/removeGrabTaskPhone', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function updatePhone(body: any, options?: { [key: string]: any }) {
  return request('/api/updatePhone', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function exportVcf(params: any, options?: { [key: string]: any }) {
  return request('/api/exportVcf', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function focusUserList(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/focusUserList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function removeFocusUser(body: any, options?: { [key: string]: any }) {
  return request('/api/removeFocusUser', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function blackFocusUser(body: any, options?: { [key: string]: any }) {
  return request('/api/blackFocusUser', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function blackFocusUserList(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/blackFocusUserList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function removeBlackFocusUser(body: any, options?: { [key: string]: any }) {
  return request('/api/removeBlackFocusUser', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function focusUserChatList(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/focusUserChatList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function focusUserStatistics(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/focusUserStatistics', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function machineDataList(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/machineDataList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function cityStatistics(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/api/cityStatistics', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
