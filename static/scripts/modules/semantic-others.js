Vue.component('ego-graph-center', {
    props: [
        'graph'
    ],
    template: `
    <div class="ego-graph-center" @click="setEgo(graph.center)">
        {{
            graph.center.name.length > 11 ?
            graph.center.name.slice(0, 11) + '...' : graph.center.name
        }}
    </div>`,
    methods: {
        setEgo(node) {
            bus.$emit('ego-changed', node);
        }
    },
})

Vue.component('ego-graph-node', {
    props: [
        'node'
    ],
    template: `
    <div class="ego-graph-node" @click="setEgo(node)">
        {{node.name}}
    </div>`,
    methods: {
        setEgo(node) {
            bus.$emit('ego-changed', node);
        }
    },
})

Vue.component('ego-graph', {
    props: [
        'graph',
        'selected',
        'currentOntology',
        'currentConnected',
        'currentSearch'
    ],
    template: `
    <div 
    class="ego-graph"
    :class="{selected: selected}"
    >
        <ego-graph-center :graph="graph"></ego-graph-center>
        <div class="nodes-right">
            <ego-graph-node 
            v-for="node in graph.nodes" :node="node" :key="node.id"
            ></ego-graph-node>
        </div>
    </div>`
})


Vue.component('graph-row', {
    props: [
        'graphs',
        'currentOntology',
        'currentConnected',
        'currentSearch'
    ],
    template: `
    <div 
    class="graph-row"
    >
        <div class="graphs-string">
            <ego-graph v-for="graph in graphs"
            :key="graph.center.id"
            :graph="graph"
            v-if="currentSearch.length === 0 || searchInGraph(graph, currentSearch)"
            ></ego-graph>
        </div>
    </div>`,
    methods: {
        searchInGraph(graph, keyword) {
            if (graph.center.name.indexOf(keyword) >= 0) {
                return true;
            } else {
                for (var node of graph.nodes) {
                    if (node.name.indexOf(keyword) >= 0) {
                        return true;
                    }
                }
            }
            return false;
        }
    }
})


Vue.component('small-node', {
    props: [
        'name'
    ],
    template: `
    <div 
    class="node small"
    >
        <span>{{name.length > 3 ? name.slice(0, 3) + '...' : name}}</span>
    </div>`,
    methods: {
        setEgo(node) {
            bus.$emit('ego-changed', node);
        }
    },
})

Vue.component('small-nodes-row', {
    props: [
        'name',
        'nodes',
        'currentSearch'
    ],
    template: `
    <div 
    class="nodes-row small"
    >
        <span class="name">{{name}}</span>
        <div class="nodes-string">
            <small-node v-for="node in nodes" :name="node.name" :key="node.name"
            v-if="currentSearch.length === 0 || node.name.indexOf(currentSearch) >= 0 || node.type.indexOf(currentSearch) >= 0"></small-node>
        </div>
    </div>`
})

Vue.component('semantic-others', {
    props: [
        'currentOntology',
        'currentConnected',
        'currentSearch'
    ],
    template: `
    <div 
    class="assorted-nodes"
    >
        <graph-row
        :graphs="graphs"
        :current-ontology="currentOntology" 
        :current-connected="currentConnected"
        :current-search="currentSearch"
        ></graph-row>

        
    </div>`,
    data: function () {
        return {
            graphs: [],
            allNodes: [],
            selected: 'none',
        }
    },
    watch: {
        currentOntology: function () {
            axios.get('/ontology/nodes/' + this.currentOntology).then((res) => {
                this.allNodes = res.data.sort(compareNodes);
            })
        },
        currentConnected: function () {
            axios.get('/ontology/ego?onto1=' + this.currentConnected + '&onto2=' + this.currentOntology).then((res) => {
                this.graphs = res.data;
                for (var graph of this.graphs) {
                    if (graph.center.ontology === '历史记录') {
                        graph.center['name'] += ' ' + graph.center['时间'].slice(4, 6) + '/' + graph.center['时间'].slice(6, 8) + ' ' + graph.center['时间'].slice(8, 10) + ':' + graph.center['时间'].slice(10, 12);
                    }
                    graph.nodes.sort(compareNodes);
                }
            })
        }
    }
})

/* 
<small-nodes-row :nodes="allNodes"
        :current-search="currentSearch"
        ></small-nodes-row>
        */