Vue.component('location-node', {
    props: [
        'node',
        'large'
    ],
    template: `
    <div class="location-node" 
    :style="{left: node.x * 700 / 1132 + 'px', top: node.y * 700 / 1132 + 'px'}"
    :class="{large: large}"
    @click="setEgo(node)">
        <div class="circle"></div>
        <span>{{node.name}}</span>
    </div>`,
    methods: {
        setEgo(node) {
            bus.$emit('ego-changed', node);
        }
    },
})


Vue.component('semantic-locations', {
    props: [
        'currentOntology',
        'currentConnected',
        'currentSearch'
    ],
    template: `
    <div 
    class="assorted-nodes semantic-locations"
    >
        <img src="assets/Map.png" />
        <div class="location-nodes">
            <location-node v-for="node in nodes" :key="node.id" :node="node" 
            :large="currentSearch.length > 0 && (node.name.indexOf(currentSearch) >= 0 || node.type.indexOf(currentSearch) >= 0)"
            v-if="currentSearch.length === 0 || node.name.indexOf(currentSearch) >= 0 || node.type.indexOf(currentSearch) >= 0"
            ></location-node>
        </div>
    </div>`,
    data: function () {
        return {
            nodes: []
        }
    },
    watch: {
        currentOntology: function () {
            axios.get('/ontology/nodes/location/' + this.currentOntology).then((res) => {
                this.nodes = res.data;
            })
        }
    }
})