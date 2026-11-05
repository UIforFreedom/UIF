// set NODE_OPTIONS=--openssl-legacy-provider
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import 'element-ui/lib/theme-chalk/index.css'
import "element-ui/lib/theme-chalk/display.css";
import '@/styles/index.scss' // global css
import '@/styles/index.css' // global css
import '@/styles/my.css'
import '@/icons' // icon
import '@/permission' // permission control

// 引入 core-js 进行 polyfill
import 'core-js/stable'; // 所有常用的核心 polyfill
import 'regenerator-runtime/runtime'; // 异步生成器（async/await）的支持

import Editor from 'bin-ace-editor';
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import Vue from 'vue'
import VueClipboard from "vue-clipboard2";

import App from './App'
import router from './router'
import store from './store'

import Clarity from '@microsoft/clarity';

Clarity.init("prdi3pfx5y");

import {
  polyfillCountryFlagEmojis
} from "country-flag-emoji-polyfill";
polyfillCountryFlagEmojis();


// 按需引入需要的语言包皮肤等资源
require('brace/ext/emmet') // 如果是lang=html时需引入
require('brace/ext/language_tools') // language extension

require('brace/mode/json')
require('brace/snippets/json')
require('brace/theme/chrome')
// 注册组件后即可使用
Vue.component(Editor.name, Editor)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const {
    mockXHR
  } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, {
  locale
});

Vue.use(VueClipboard);
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false;

import uif from './store/uif/uif'

Vue.prototype.$translator = function (i) {
  var l = uif.state.config.lang
  if (!(l in i)) {
    l = 'cn'
  }
  return i[l];
};

Vue.prototype.$delayColor = function (delay) {
  if (delay < 0) {
    return "red";
  }
  if (delay <= 100) {
    return "#7A9D54";
  }
  if (delay <= 200) {
    return "#557A46";
  }
  if (delay <= 300) {
    return "#F0B86E";
  }
  if (delay <= 400) {
    return "#FD8D14";
  }
  return "#8C3333";
};

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
