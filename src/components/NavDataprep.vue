<template>
  <div class="navbar-menu">

    <div class="navbar-start">
      <div class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link is-active">
          <span
            class="control"
             v-on:mouseover="loadProjectsList()"
          >
          {{localization.navbar.projects[lang]}}
          </span>
        </a>
        <div class="navbar-dropdown">
          <a
            class="navbar-item"
            @click="newObject={show: true, type: 'project', action: 'new'}"
          >
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item">
                  <span class="icon has-text-info">
                    <i class ="fa fa-plus"></i> &nbsp; &nbsp;
                  </span>
                </div>
              </div>
              <div class="level-right">
                <div class="level-item">
                  <span class="has-text-info">
                    {{ localization.dataprep.newProject[lang] }}
                  </span>
                </div>
              </div>
            </div>
          </a>
          <a
            class="navbar-item"
            @click="newObject={show: true, type: 'project', action: 'import'}"
          >
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item">
                  <span class="icon has-text-info">
                    <i class ="fa fa-upload"></i> &nbsp; &nbsp;
                  </span>
                </div>
              </div>
              <div class="level-right">
                <div class="level-item">
                  <span class="has-text-info">
                    {{ localization.dataprep.importProject[lang] }}
                  </span>
                </div>
              </div>
            </div>
          </a>
          <a
            class="navbar-item"
            v-for="aProj in projects"
            :key="aProj.key"
            :class="{'is-active' : aProj === project}"
            @click="changeProj(aProj)"
          >
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item">
                  <span class="icon has-text-info">
                    <i class="fa"></i> &nbsp; &nbsp;
                  </span>
                </div>
              </div>
              <div class="level-right">
                <div class="level-item">
                  <span>
                    {{ aProj }}
                  </span>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
      <div v-show="project !== ''" class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link is-active">
          <span
            class="control"
             v-on:mouseover="loadObjectsList()"
          >
          {{localization.navbar.datasets[lang]}}
          </span>
        </a>
        <div class="navbar-dropdown">
          <a
            class="navbar-item"
            @click="newObject={show: true, type: 'dataset', action: 'new'}"
          >
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item">
                  <span class="icon has-text-info">
                    <i class="fa fa-plus"></i>  &nbsp;&nbsp;
                  </span>
                </div>
              </div>
              <div class="level-right">
                <div class="level-item has-text-info">
                 {{ localization.dataprep.newDataset[lang] }}
                </div>
              </div>
            </div>
          </a>
          <a
            class="navbar-item"
            @click="newObject={show: true, type: 'dataset', action: 'import'}"
          >
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item">
                  <span class="icon has-text-info">
                    <i class="fa fa-upload"></i>  &nbsp;&nbsp;
                  </span>
                </div>
              </div>
              <div class="level-right">
                <div class="level-item has-text-info">
                 {{ localization.dataprep.importDataset[lang] }}
                </div>
              </div>
            </div>
          </a>

          <a
            class="navbar-item"
            v-for="aDataset in datasets"
            :key="aDataset.key"
            :class="{'is-active' : (Object.keys(aDataset)[0] === Object.keys(object)[0])}"
            @click="changeObj(aDataset)"
          >
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item">
                  <span class="icon has-text-info">
                    <i class="fa" :class="[aDataset[Object.keys(aDataset)[0]].validation === true ? 'fa-check has-text-primary' : '']" @click="validateObj(aDataset)"></i>  &nbsp;&nbsp;
                  </span>
                </div>
              </div>
              <div class="level-right">
                <div class="level-item">
                    {{ Object.keys(aDataset)[0] }}
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
      <div v-show="project !== ''" class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link is-active">
          <span
            class="control"
             v-on:mouseover="loadObjectsList() & checkRecipesSatus()"
          > {{localization.navbar.recipes[lang]}} </span>
        </a>
        <div class="navbar-dropdown">
          <a
            class="navbar-item"
            @click="newObject={show: true, type: 'recipe', action: 'new'}"
          >
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item">
                  <span class="icon has-text-info">
                    <i class="fa fa-plus"></i>  &nbsp;&nbsp;
                  </span>
                </div>
              </div>
              <div class="level-right">
                <div class="level-item has-text-info">
                  {{ localization.dataprep.newRecipe[lang] }}
                </div>
              </div>
            </div>
          </a>
          <a
            class="navbar-item"
            @click="newObject={show: true, type: 'recipe', action: 'import'}"
          >
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item">
                  <span class="icon has-text-info">
                    <i class="fa fa-upload"></i>  &nbsp;&nbsp;
                  </span>
                </div>
              </div>
              <div class="level-right">
                <div class="level-item has-text-info">
                  {{ localization.dataprep.importRecipe[lang] }}
                </div>
              </div>
            </div>
          </a>

          <a
            class="navbar-item"
            v-for="aRecipe in recipes"
            :key="aRecipe.key"
            :class="{'is-active' : (Object.keys(aRecipe)[0] === Object.keys(object)[0])}"
            @click="changeObj(aRecipe)"
          >
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item">
                  <span class="icon has-text-info">
                    <i
                      class="fa"
                      :class="[(aRecipe[Object.keys(aRecipe)[0]].running === true ? 'fa-cog fa-spin has-text-danger' : ( Object.keys(aRecipe)[0] === Object.keys(object)[0] ? 'fa-play has-text-primary' : ''))]"
                       @click="(Object.keys(aRecipe)[0] === Object.keys(object)[0] || aRecipe[Object.keys(aRecipe)[0]].running === true) ? runStopRecipe(aRecipe) : ''"
                    ></i> &nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                </div>
              </div>
              <div class="level-right">
                <div class="level-item">
                    {{ Object.keys(aRecipe)[0] }}
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>

    <div class="navbar-end">
      <div class="navbar-item has-text-centered">
        <div class="hero has-text-right">
          <div class="level-item has-text-centered">

            <div>
              <p class="title is-4">  {{project}} </p>
              <p></p>
              <p class="is-small"> {{Object.keys(object)[0]}} </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <new-object
      v-show="newObject.show"
      @close="newObject.show = false"
      :type="newObject.type"
      :action="newObject.action"
    ></new-object>

  </div>
</template>

<script>
import NewObject from './NewObject'
import localization from '../assets/json/lang.json'
import apiConf from '../../matchIdConfig/backend.json'

let api = apiConf.api

export default {
  components: {
    NewObject
  },
  data () {
    return {
      newObject: {
        show: false,
        type: 'project',
        action: 'new'
      },
      localization: localization,
      langs: localization.available,
      lang: localization.default,
      validation: false,
      object: {},
      projects: [],
      project: '',
      recipes: {empty: {'empty - choose a project first': {running: false}}},
      datasets: {empty: {'empty - choose a project first': 'null'}},
      source: ''
    }
  },
  methods: {
    changeProj (aProj) {
      this.project = aProj
      window.bus.$emit('projectChange', this.project)
      this.loadObjectsList()
    },
    changeObj (anObj) {
      if (this.object !== anObj) {
        this.validation = false
        window.bus.$emit('validationDisplay', false)
        this.object = anObj
        window.bus.$emit('objectChange', this.object)
      }
    },
    validateObj (anObj) {
      this.validation = true
      var w = window
      var name = Object.keys(anObj)[0]
      this.$http.put(api.url + '/datasets/' + name + '/validation')
        .then(response => {
          w.bus.$emit('validationConfig', response.body)
          w.bus.$emit('validationDisplay', true)
        })
    },
    loadProjectsList () {
      this.$http.get(api.url + '/conf/')
        .then(response => {
          this.projects = Object.keys(response.body.projects)
        },
          response => {
          })
    },
    loadObjectsList () {
      var vue = this
      var recipes = []
      var datasets = []
      this.$http.get(api.url + '/datasets/')
        .then(response => {
          for (var dataset in response.body) {
            if (response.body[dataset].project === this.project) {
              var obj = {}
              obj[dataset] = response.body[dataset]
              obj[dataset].type = 'dataset'
              datasets.push(obj)
            }
          }
          vue.datasets = datasets
        },
          response => {
          })
      this.$http.get(api.url + '/recipes/')
        .then(response => {
          for (var recipe in response.body) {
            if (response.body[recipe].project === this.project) {
              var obj = {}
              obj[recipe] = response.body[recipe]
              obj[recipe].type = 'recipe'
              obj[recipe].running = false
              recipes.push(obj)
            }
          }
          vue.recipes = recipes
        },
          response => {
          })
    },
    runStopRecipe (aRecipe) {
      var vue = this
      var name = Object.keys(aRecipe)[0]
      var index = null
      for (var i in this.recipes) {
        if (aRecipe === this.recipes[i]) {
          index = i
        }
      }

      if (aRecipe[name].running === true) {
        this.$http.put(api.url + '/recipes/' + name + '/stop')
          .then(response => {
            vue.recipes[index][name].running = false
          })
      } else {
        this.$http.put(api.url + '/recipes/' + name + '/run')
          .then(response => {
            vue.recipes[index][name].running = true
          })
      }
    },
    checkRecipesSatus () {
      for (var index in this.recipes) {
        var aRecipe = this.recipes[index]
        this.checkRecipeSatus(aRecipe, index)
      }
    },
    checkRecipeSatus (aRecipe, index) {
      var vue = this
      var name = Object.keys(aRecipe)[0]
      this.$http.get(api.url + '/recipes/' + name + '/status')
        .then(response => {
          if (response.body.status === 'up') {
            vue.recipes[index][name].running = true
          } else {
            vue.recipes[index][name].running = false
          }
        })
    }
  },
  mounted () {
    let self = this

    this.loadProjectsList(this.project)

    window.bus.$on('langChange', function (value) {
      self.lang = value
    })

    window.bus.$on('projectChange', function (value) {
      self.project = value
      window.bus.$emit('objectChange', {})
    })

    window.bus.$on('objectChange', function (object) {
      self.object = object
    })
  }
}
</script>

<style scoped lang="less">
.nav {
  height: 2.75rem;
  > .container {
    min-height: 2.75rem;
  }
}
.nav-toggle {
  height: 2.75rem;
}
</style>
