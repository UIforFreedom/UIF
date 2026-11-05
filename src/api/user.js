import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'http://127.0.0.1:9090/login',
    method: 'get',
    params: {
      "password": data['password']
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: {
      token
    }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
