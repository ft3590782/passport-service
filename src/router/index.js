import Vue from 'vue'
import Router from 'vue-router'
import uploadImage from '@/pages/uploadImage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'uploadImage',
      component: uploadImage
    }
  ]
})
