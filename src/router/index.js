import Vue from 'vue'
import Router from 'vue-router'
import Dataprep from '@/components/Dataprep'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dataprep',
      component: Dataprep
    }
  ]
})
