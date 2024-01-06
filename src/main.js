// set NODE_OPTIONS=--openssl-legacy-provider
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import 'element-ui/lib/theme-chalk/index.css'
import "element-ui/lib/theme-chalk/display.css";
import '@/styles/index.scss' // global css
import '@/styles/index.css'  // global css
import '@/icons'             // icon
import '@/permission'        // permission control

import Editor from 'bin-ace-editor';
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import Vue from 'vue'
import VueClipboard from "vue-clipboard2";
import CountryFlag from 'vue-country-flag'

import App from './App'
import router from './router'
import store from './store'

// 按需引入需要的语言包皮肤等资源
require('brace/ext/emmet')          // 如果是lang=html时需引入
require('brace/ext/language_tools') // language extension

require('brace/mode/json')
require('brace/snippets/json')
require('brace/theme/chrome')
// 注册组件后即可使用
Vue.component(Editor.name, Editor)
Vue.component('country-flag', CountryFlag)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const {mockXHR} = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, {locale});

Vue.use(VueClipboard);
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false;

new Vue({el : '#app', router, store, render : h => h(App)})
