import Cookies from 'js-cookie'
import axios from 'axios'

const TokenKey = 'uif_user_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function Login(pwd) {
  console.log("sadf")
  return axios.get('http://127.0.0.1:9090/login', {
    params: {
      'password': pwd
    }
  })
}
