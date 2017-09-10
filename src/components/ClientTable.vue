<template>
	<div id='table'>
    this is here
		<client-table :data='tableData' :columns='columns' :options='options'></client-table>
	</div>
</template>

<script>
  import { ClientTable } from 'vue-tables-2'
  // import apiConf from '../../matchIdConfig/json/backend.json'
  // let api = apiConf.api

  export default {
    components: {
      ClientTable
    },
    data () {
      return {
        columns: ['id', 'name', 'age'],
        tableData: [
          {id: 1, name: 'John', age: '20'},
          {id: 2, name: 'Jane', age: '24'},
          {id: 3, name: 'Susan', age: '16'},
          {id: 4, name: 'Chris', age: '55'},
          {id: 5, name: 'Dan', age: '40'}
        ],
        options: {}
      }
    },
    mounted () {
      var vue = this
      console.log(vue)
    },
    methods: {
    }
  }

</script>
