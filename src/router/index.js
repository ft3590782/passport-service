import Vue from 'vue'
import Router from 'vue-router'
import uploadImage from '@/pages/uploadImage'
import test from '@/pages/test'
Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'uploadImage',
      component: uploadImage
    },
    {
      path: '/test',
      name: 'test',
      component: test
    }
  ]
})
