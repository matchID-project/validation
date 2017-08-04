import Vue from 'vue'
import Router from 'vue-router'
import Validation from '@/components/Validation'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ValidationTable',
      component: Validation
    }
  ]
})
