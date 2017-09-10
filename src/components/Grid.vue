<template>
<div id="grid-template" >
  <table class="grid">
    <thead class="grid">
      <tr class="grid">
        <th class="grid" v-for="key in filteredColumns"
          @click="sortBy(key)"
          :class="{ active: sortKey == key }"
          :title="key">
          <i class="fa is-normal" :class="sortKey == key ? (sortOrders[key] > 0 ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc') : ''">
          </i>
          <span class="is-normal">
          {{ key }}
          </span>
        </th>
      </tr>
    </thead>
    <tbody class="grid">
      <tr v-for="entry in filteredData">
        <td class="grid" v-for="key in filteredColumns" :title="entry[key]">
          {{entry[key]}}
        </td>
      </tr>
    </tbody>
  </table>
</div>

</template>


<script>

export default {
  template: '#grid-template',
  props: {
    data: Array,
    columns: Array,
    filterKey: String,
    columnsFilter: String,
    pageNumber: Number,
    pageSize: Number
  },
  data: function () {
    var sortOrders = {}
    this.columns.forEach(function (key) {
      sortOrders[key] = 1
    })
    return {
      sortKey: '',
      sortOrders: sortOrders
    }
  },
  computed: {
    count: function () {
      return this.data.length
    },
    filterCount: function () {
      return this.filteredData().length
    },
    pageCount: function () {
      return Math.floor(this.filteredData().length / this.pageSize) + 1
    },
    filteredColumns: function () {
      var columnsFilter = this.columnsFilter
      if (columnsFilter === '' || columnsFilter === undefined) {
        return this.columns
      }
      return this.columns.filter(function (col) {
        return col.match(columnsFilter)
      })
    },
    filteredData: function () {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()

      var order = this.sortOrders[sortKey] || 1
      var data = this.data
      if (filterKey) {
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      if (sortKey) {
        data = data.slice().sort(function (a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize)
    }
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {
    sortBy: function (key) {
      if (this.sortOrders[key] === undefined) {
        this.sortOrders[key] = 1
      }
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    }
  },
  mounted () {
    var vue = this
    window.bus.$on('columnsChange', function (columns) {
      var sortOrders = {}
      columns.forEach(function (key) {
        sortOrders[key] = 1
      })
      vue.sortOrders = sortOrders
      // console.log(vue.sortOrders)
    })
  }
}

</script>

