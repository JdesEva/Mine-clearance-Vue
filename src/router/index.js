import Vue from 'vue'
import Router from 'vue-router'
import boom from '@/components/boom/boom.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'boom',
      component: boom
    }
  ]
})
