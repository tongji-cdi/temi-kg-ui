Vue.component('node', {
    props: [
        'node'
    ],
    template: `
    <div 
    class="node"
    @click="setEgo(node)"
    >
        <span>{{node.name.length >= 5 ? node.name.slice(0, 5) + '...' : node.name}}</span>
    </div>`,
    methods: {
        setEgo(node) {
            bus.$emit('ego-changed', node);
        }
    },
})

Vue.component('nodes-row', {
    props: [
        'name',
        'nodes',
        'currentSearch'
    ],
    template: `
    <div 
    class="nodes-row"
    >
        <span class="name">{{name}}</span>
        <div class="nodes-string">
            <node v-for="node in nodes" :node="node" :key="node.name"
            v-if="currentSearch.length === 0 || node.name.indexOf(currentSearch) >= 0 || node.type.indexOf(currentSearch) >= 0"></node>
        </div>
    </div>`
})

Vue.component('semantic-default', {
    props: [
        'currentOntology',
        'currentConnected',
        'currentSearch'
    ],
    template: `
    <div 
    class="assorted-nodes"
    >
        <nodes-row v-for="nodeGroup in nodeGroups"
        :key="nodeGroup.name" :name="nodeGroup.name" :nodes="nodeGroup.nodes"
        :current-search="currentSearch"
        ></nodes-row>
    </div>`,
    data: function () {
        return {
            nodeGroups: [],
        }
    },
    watch: {
        currentOntology: function () {
            axios.get('/ontology/types/' + this.currentOntology).then((res1) => {
                this.nodeGroups = [];
                
                for (var i = 0; i < res1.data.length; i++) {
                    axios.get('/type/nodes/' + res1.data[i]).then((res2) => {
                        res2.data.nodes.sort(compareNodes);
                        this.nodeGroups.push(res2.data)
                    });
                }
                
            })
        }
    }
})