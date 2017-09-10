import Vue from 'vue'
import Router from 'vue-router'
import Validation from '@/components/Validation'
import Dataprep from '@/components/Dataprep'
// import Codemirror from '@/components/Codemirror'
// import Viewdata from '@/components/Viewdata'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dataprep',
      component: Dataprep
      // components: {
      //   code: Codemirror,
      //   default: Viewdata
      // },
      // props: {
      //   code: true,
      //   default: true
      // }
    },
    {
      path: '/validation',
      name: 'ValidationTable',
      component: Validation
    }
  ]
})
