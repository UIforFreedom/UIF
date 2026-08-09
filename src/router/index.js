import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

import uif from '@/store/uif/uif'
import {
  GetSimpleStyle,
  Translator
} from '@/utils'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see:
 https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the
 sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than
 one children route,
 *                                it will becomes nested mode, otherwise not
 show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the
 breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple
 roles) title: 'title'               the name show in sidebar and breadcrumb
 (recommend set) icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in
 breadcrumb(default is true) activeMenu: '/example/list'  if set path, the
 sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

function createRouter() {
  var isSimple = GetSimpleStyle()

  var dynamicRoutes = [

    {
      path: '/404',
      component: () => import('@/views/404'),
      hidden: true
    },

    {
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [{
        path: 'home',
        name: Translator({
          'cn': '主页',
          'en': 'Dashboard'
        }),
        component: () => import('@/uif_views/dashboard/index'),
        meta: {
          title: Translator({
            'cn': '主页',
            'en': 'Dashboard'
          }),
          icon: 'dashboard'
        }
      }]
    },
    {
      path: '/login',
      component: () => import('@/views/login/index.vue'),
      hidden: true
    },
    // {
    //   path: '/profile',
    //   component: Layout,
    //   redirect: '/profile',
    //   name: 'Example',
    //   meta: {
    //     title: 'Profiles',
    //     icon: 'el-icon-s-management'
    //   },
    //   children: [{
    //     path: 'Profiles',
    //     name: 'Profiles',
    //     component: () => import('@/uif_views/profile/profile.vue'),
    //     meta: {
    //       title: 'Profiles',
    //       icon: 'el-icon-s-management'
    //     },
    //   }]
    // },

    {
      path: '/settings',
      component: Layout,
      redirect: '/settings/uif',
      name: 'Example',
      meta: {
        title: Translator({
          'cn': '设置',
          'en': 'Settings'
        }),
        icon: 'el-icon-setting'
      },
      children: [{
        path: 'uif',
        name: 'Table',
        component: () => import('@/uif_views/settings/uif'),
        meta: {
          title: Translator({
            'cn': '设置',
            'en': 'Settings'
          }),
          icon: 'el-icon-setting'
        },
      }]
    },
    {
      path: '/in',
      component: Layout,
      hidden: isSimple,
      redirect: '/in',
      children: [{
        path: 'my',
        name: '主页',
        component: () => import('@/uif_views/inbounds/in.vue'),
        meta: {
          title: Translator({
            'cn': '入站',
            'en': 'Inbounds'
          }),
          icon: 'el-icon-s-flag'
        }
      }]
    },
    {
      path: '/out',
      component: Layout,
      redirect: '/out',
      name: 'out',
      hidden: isSimple,
      meta: {
        title: Translator({
          'cn': '出站',
          'en': 'Outbounds'
        }),
        icon: 'el-icon-position'
      },
      children: [{
        path: 'my',
        component: () =>
          import('@/uif_views/outbounds/my_servers/out.vue'),
        name: 'home',
        meta: {
          title: Translator({
            'cn': '自添加',
            'en': 'Mine'
          }),
          icon: 'el-icon-circle-plus-outline'
        }
      },
      {
        path: 'subscribe',
        component: () =>
          import('@/uif_views/outbounds/subscribe/subscribe.vue'),
        name: 'subscribe',
        meta: {
          title: Translator({
            'cn': '我的订阅',
            'en': 'Subscription'
          }),
          icon: 'el-icon-bell'
        }
      },
      {
        path: 'select',
        component: () =>
          import('@/uif_views/outbounds/simplified/simple.vue'),
        name: 'subscribe',
        meta: {
          title: Translator({
            'cn': '节点选择',
            'en': 'Selection'
          }),
          icon: 'el-icon-thumb'
        }
      }
      ]
    },
    {
      path: '/simple',
      component: Layout,
      redirect: '/simple',
      hidden: !isSimple,
      children: [{
        path: 'out',
        name: '出站',
        component: () =>
          import('@/uif_views/outbounds/simplified/simple.vue'),
        meta: {
          title: Translator({
            'cn': '出站',
            'en': 'Outbounds'
          }),
          icon: 'el-icon-position'
        }
      }]
    },
    {
      path: '/route',
      component: Layout,
      redirect: '/route',
      hidden: isSimple,
      name: 'Example',
      meta: {
        title: Translator({
          'cn': '路由',
          'en': 'Routes'
        }),
        icon: 'el-icon-ship'
      },
      children: [{
        path: 'my',
        name: 'route',
        component: () => import('@/uif_views/routing/route.vue'),
        meta: {
          title: Translator({
            'cn': '自添加',
            'en': 'Mine'
          }),
          icon: 'el-icon-circle-plus-outline'
        }
      },
      {
        path: 'status',
        name: 'status',
        component: () => import('@/uif_views/clash/clash.vue'),
        meta: {
          title: Translator({
            'cn': '数据',
            'en': 'Data'
          }),
          icon: 'el-icon-s-data'
        }
      },
      {
        path: 'user_manager',
        name: 'user_manager',
        component: () => import('@/uif_views/user_manager/user_manager.vue'),
        hidden: true,
        meta: {
          title: Translator({
            'cn': '后台',
            'en': 'Data'
          }),
          icon: 'el-icon-s-data'
        }
      },
      ],
    },
    {
      path: '/help',
      component: Layout,
      hidden: isSimple,
      meta: {
        title: Translator({
          'cn': '帮助',
          'en': 'Help'
        }),
        icon: 'el-icon-notebook-1'
      },
      children: [{
        path: 'https://uiforfreedom.github.io/UIF_help',
        meta: {
          title: Translator({
            'cn': '使用手册',
            'en': 'Specification'
          }),
          icon: 'link'
        }
      },
      {
        path: 'https://uiforfreedom.github.io/UIF_help/blog',
        meta: {
          title: Translator({
            'cn': '文章分享',
            'en': 'Blog'
          }),
          icon: 'link'
        }
      }
      ]
    },

    {
      path: 'external-link',
      component: Layout,
      hidden: isSimple,
      children: [{
        path: 'https://github.com/UIforFreedom/UIF',
        meta: {
          title: Translator({
            'cn': 'UIF 官网',
            'en': 'Official Website'
          }),
          icon: 'link'
        }
      }]
    },

    // 404 page must be placed at the end !!!
    {
      path: '*',
      redirect: '/404',
      hidden: true
    }
  ]

  return new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
      y: 0
    }),
    routes: dynamicRoutes
  })
}

const router = createRouter()

// Detail see:
// https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
