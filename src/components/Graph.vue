<template>
  <div class="modal is-active ">
    <div class="modal-background" @click="close()"></div>
    <div class="column is-9">
      <div class="modal-content is-12">
        <div class="card">
          <div class="card-header">
            <div class="card-header-title" >
              <i class="fa fa-connectdevelop mID-margin-right-8" aria-hidden="true"></i> {{ localization.graph.title[lang] }}
              <span class="title is-4"> &nbsp; {{project}} </span>
            </div>
            <div class="card-header-icon">
              <button class="delete" @click="close()"></button>
            </div>
          </div>
          <div class="card-content has-text-centered">
            <div id="d3">
              <svg xmlns="http://www.w3.org/2000/svg" 
                   :width="width+'px'"
                   :height="height+'px'"
                   @mousemove="drag($event)"
                   @mouseup="drop()"
                   v-if="bounds.minX">
             

                <line v-for="link in links"
                      :x1="coords[link.source.index].x"
                      :y1="coords[link.source.index].y"
                      :x2="coords[link.target.index].x"
                      :y2="coords[link.target.index].y"
                      :stroke="colors[linkStatus(link)]" 
                      :stroke-width="strokes[linkStatus(link)]"
                      :stroke-dasharray="strokeDasharray[linkStatus(link)]"
                      marker-end="url(#arrow)"
                      ></line>    

                <circle v-for="(node, i) in nodes"
                         v-tooltip="node.type + ': ' + node.name"
                        :cx="coords[i].x"
                        :cy="coords[i].y"
                        :r="circles[nodeStatus(node)]" fill="white"
                        :stroke="colors[nodeStatus(node)]" 
                        :stroke-width="strokes[nodeStatus(node)]"
                        @mousedown="currentMove = {x: $event.screenX, y: $event.screenY, node: node}"
                        @click="toggle(node)"
                        >
                </circle>
                <icon v-for="(node, i) in nodes"
                      v-show="nodeStatus(node) !== 'inactive'"
                      :name="icons[node.type]" 
                      :x="coords[i].x-8"
                      :y="coords[i].y-8"
                      :color="colors[nodeStatus(node)]"
                      @mousedown="currentMove = {x: $event.screenX, y: $event.screenY, node: node}"
                >
                      
                </icon>

                <text v-for="(node, i) in nodes"
                        v-show="show[node.name+node.type]"
                        :x="coords[i].x"
                        :y="coords[i].y+25"
                        :fill="colors[node.type]"
                        class="is-small"
                        text-anchor="middle"
                        @mousedown="currentMove = {x: $event.screenX, y: $event.screenY, node: node}"
                        > 

                        {{node.name}}
                </text>



              </svg>
            </div>

          </div>
          <div class="card-footer has-text-centered">
          </div>
        </div>
      </div>
    </div>
    <button class="modal-close is-large" @click="close()"></button>

  </div>
</template>

<script>
import localization from '../../matchIdConfig/json/lang.json'
import * as d3 from 'd3'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'

export default {
  components: {
    Icon
  },
  props: {
    datasets: Object,
    recipes: Object,
    project: String
  },
  data () {
    return {
      localization: localization,
      langs: localization.available,
      lang: localization.default,
      nodes: Object.keys(this.datasets).map(i => ({ index: i, name: i, type: 'dataset', props: this.datasets[i], x: null, y: null }))
        .concat(Object.keys(this.recipes).map(i => ({ index: i, name: i, type: 'recipe', props: this.recipes[i], x: null, y: null })))
        .concat([{name: this.project, type: 'project', props: { project: this.project }, x: null, y: null}]),
      width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0) * 0.66,
      height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0) * 0.8,
      padding: 20,
      show: {},
      linkStrength: {
        'projectLink': 0.1,
        'link': 1,
        'recipeCall': 0.1,
        'join': 1
      },
      collide: {
        'project': 50,
        'dataset': 30,
        'recipe': 30,
        'inactive': 1
      },
      charge: {
        'project': 1,
        'dataset': -20,
        'recipe': -20,
        'inactive': -100
      },
      colors: {
        'project': '#00d1b2',
        'projectLink': '#00d1b2',
        'dataset': 'blue',
        'recipe': 'red',
        'link': '#00d1b2',
        'join': 'red',
        'inactive': '#aaa',
        'recipeCall': '#00d1b2'
      },
      circles: {
        'project': 32,
        'dataset': 16,
        'recipe': 16,
        'inactive': 6
      },
      icons: {
        'project': 'industry',
        'dataset': 'table',
        'recipe': 'flask'
      },
      strokeDasharray: {
        'projectLink': '0',
        'join': '5,5',
        'recipeCall': '0',
        'link': '0',
        'inactive': '5,5'
      },
      strokes: {
        'link': 1.5,
        'join': 1,
        'dataset': 1,
        'recipe': 1,
        'project': 2,
        'projectLink': 0.5,
        'recipeCall': 0.5,
        'inactive': 0.5
      },
      simulation: null,
      currentMove: null
    }
  },
  computed: {
    bounds () {
      return {
        minX: Math.min(...this.nodes.map(n => n.x)),
        maxX: Math.max(...this.nodes.map(n => n.x)),
        minY: Math.min(...this.nodes.map(n => n.y)),
        maxY: Math.max(...this.nodes.map(n => n.y))
      }
    },
    coords () {
      return this.nodes.map(node => {
        return {
          x: this.padding + (node.x - this.bounds.minX) * (this.width - 2 * this.padding) / (this.bounds.maxX - this.bounds.minX),
          y: this.padding + (node.y - this.bounds.minY) * (this.height - 2 * this.padding) / (this.bounds.maxY - this.bounds.minY)
        }
      })
    },
    fake_links () {
      return null
    },
    links () {
      var links = []
      // project to objects
      links = links.concat(Object.keys(this.recipes).filter(i => (this.recipes[i].project === this.project)).map(i => ({ source: this.getNodeIndex(this.project, 'project'), target: this.getNodeIndex(i, 'recipe'), enabled: true, type: 'projectLink' })))

      links = links.concat(Object.keys(this.datasets).filter(i => (this.datasets[i].project === this.project)).map(i => ({ source: this.getNodeIndex(this.project, 'project'), target: this.getNodeIndex(i, 'dataset'), enabled: true, type: 'projectLink' })))

      // adds input dataset to recipe link
      links = links.concat(Object.keys(this.recipes).map(i => ({source: this.getSourceNode(i), target: this.getNodeIndex(i, 'recipe'), enabled: true, type: 'link'})))
      // adds output dataset to recipe link
      links = links.concat(Object.keys(this.recipes).map(i => ({source: this.getNodeIndex(i, 'recipe'), target: this.getTargetNode(i), enabled: true, type: 'link'})))

      // adds call from recipes to recipes
      for (var recipe in this.recipes) {
        if (this.recipes[recipe].steps !== undefined) {
          links = links.concat(this.recipes[recipe].steps.map(i => ({source: this.getNodeIndex(recipe, 'recipe'), target: this.getNodeIndex(Object.keys(i)[0], 'recipe'), enabled: true, type: 'recipeCall'})))
          links = links.concat(this.recipes[recipe].steps.filter(i => (Object.keys(i)[0] === 'join')).map(i => ({source: this.getNodeIndex(recipe, 'recipe'), target: this.getNodeIndex(i.join.dataset, 'dataset'), enabled: true, type: 'join'})))
        }
      }
      return links.filter(l => (l.source !== null) && (l.target !== null)).map(link => ({
        source: link.source,
        target: link.target,
        type: link.type,
        enabled: (this.show[this.nodes[link.source].name + this.nodes[link.source].type] && this.show[this.nodes[link.target].name + this.nodes[link.target].type])
      }))
    }
  },
  created () {
    var vue = this
    for (var node in this.nodes) {
      if (this.nodes[node].props.project === this.project) {
        this.show[this.nodes[node].name + this.nodes[node].type] = true
      } else {
        this.show[this.nodes[node].name + this.nodes[node].type] = false
      }
    }
    this.simulation = d3.forceSimulation(this.nodes)
        .force('collide', d3.forceCollide(function (d) { return vue.collide[vue.nodeStatus(d)] }).iterations(16))
        .force('charge', d3.forceManyBody().strength(d => vue.charge[vue.nodeStatus(d)]))
        .force('link', d3.forceLink(this.links))
        .force('x', d3.forceX())
        .force('y', d3.forceY())
        // .linkStrength(function (link) { return vue.linkStrength[vue.linkStatus(link)] })
  },
  methods: {
    toggle: function (node) {
      this.show[node.name + node.type] = !this.show[node.name + node.type]
    },
    nodeStatus: function (node) {
      if (this.show[node.name + node.type]) {
        return node.type
      } else {
        return 'inactive'
      }
    },
    linkStatus: function (link) {
      if (this.show[link.source.name + link.source.type] && this.show[link.target.name + link.target.type]) {
        if (link.type !== undefined) {
          return link.type
        } else {
          return 'link'
        }
      } else {
        return 'inactive'
      }
    },
    close: function () {
      this.$emit('close')
    },
    getNodeIndex (name, type) {
      for (var node in this.nodes) {
        if ((this.nodes[node].name === name) && (this.nodes[node].type === type)) {
          return node
        }
      }
      return null
    },
    getNodeObject (i) {
      if (this.nodes[i].type === 'dataset') {
        return this.datasets[this.nodes[i].name]
      } else if (this.nodes[i].type === 'recipe') {
        return this.recipes[this.nodes[i].name]
      }
    },
    getDatasetNode (name) {
      for (var dataset in this.datasets) {
        if (dataset === name) {
          return this.getNodeIndex(dataset, 'dataset')
        }
      }
      return null
    },
    getTargetNode (recipe) {
      recipe = this.recipes[recipe]
      if (recipe.output === undefined) {
        return null
      } else if (typeof recipe.output === 'string') {
        return this.getDatasetNode(recipe.output)
      } else if (recipe.output.dataset !== undefined) {
        return this.getDatasetNode(recipe.output.dataset)
      } else {
        return null
      }
    },
    getSourceNode (recipe) {
      recipe = this.recipes[recipe]
      if (recipe.input === undefined) {
        return null
      } else if (typeof recipe.input === 'string') {
        return this.getDatasetNode(recipe.input)
      } else if (recipe.input.dataset !== undefined) {
        return this.getDatasetNode(recipe.input.dataset)
      } else {
        return null
      }
    },
    drag (e) {
      if (this.currentMove) {
        this.currentMove.node.fx = this.currentMove.node.x - (this.currentMove.x - e.screenX) * (this.bounds.maxX - this.bounds.minX) / (this.width - 2 * this.padding)
        this.currentMove.node.fy = this.currentMove.node.y - (this.currentMove.y - e.screenY) * (this.bounds.maxY - this.bounds.minY) / (this.height - 2 * this.padding)
        this.currentMove.x = e.screenX
        this.currentMove.y = e.screenY
      }
    },
    drop () {
      delete this.currentMove.node.fx
      delete this.currentMove.node.fy
      this.currentMove = null
      this.simulation.alpha(1)
      this.simulation.restart()
    }
  }
}
</script>

<style>
.vue-tooltip{background-color:#fff;box-sizing:border-box;color:#00d1b2;max-width:320px;padding:6px 10px;border-radius:3px;z-index:100;box-shadow:2px 2px 3px rgba(0,0,0,0.4)}
.vue-tooltip .vue-tooltip-content{text-align:center}
.vue-tooltip .tooltip-arrow{content:'';width:0;height:0;border-style:solid;position:absolute;margin:5px}
.vue-tooltip[x-placement^="top"]{margin-bottom:5px}
.vue-tooltip[x-placement^="top"] 
.tooltip-arrow{border-width:5px 5px 0 5px;border-top-color:#00d1b2;border-bottom-color:transparent !important;border-left-color:transparent !important;border-right-color:transparent !important;bottom:-5px;margin-top:0;margin-bottom:0}
.vue-tooltip[x-placement^="bottom"]{margin-top:5px}
.vue-tooltip[x-placement^="bottom"] 
.tooltip-arrow{border-width:0 5px 5px 5px;border-bottom-color:#00d1b2;border-top-color:transparent !important;border-left-color:transparent !important;border-right-color:transparent !important;top:-5px;margin-top:0;margin-bottom:0}
.vue-tooltip[x-placement^="right"]{margin-left:5px}
.vue-tooltip[x-placement^="right"]
.tooltip-arrow{border-width:5px 5px 5px 0;border-right-color:#00d1b2;border-top-color:transparent !important;border-left-color:transparent !important;border-bottom-color:transparent !important;left:-5px;margin-left:0;margin-right:0}
.vue-tooltip[x-placement^="left"]{margin-right:5px}
.vue-tooltip[x-placement^="left"] 
.tooltip-arrow{border-width:5px 0 5px 5px;border-left-color:#00d1b2;border-top-color:transparent !important;border-right-color:transparent !important;border-bottom-color:transparent !important;right:-5px;margin-left:0;margin-right:0}
</style>
