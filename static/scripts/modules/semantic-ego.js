Vue.component('ego-location-node', {
    props: [
        'node',
    ],
    template: `
    <div class="ego-location-node" 
    :style="{left: node.x * 500 / 1132 + 'px', top: node.y * 500 / 1132 + 'px'}"
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


Vue.component('ego-locations', {
    props: [
        'nodes',
        'currentSearch'
    ],
    template: `
    <div 
    class="assorted-nodes ego-locations"
    >
        <img src="assets/Map.png" />
        <div class="ego-location-nodes">
            <ego-location-node v-for="node in nodes" :key="node.id" :node="node"
            v-if="currentSearch.length === 0 || node.name.indexOf(currentSearch) >= 0 || node.type.indexOf(currentSearch) >= 0"
            ></ego-location-node>
        </div>
    </div>`
})



Vue.component('semantic-ego', {
    props: [
        'currentOntology',
        'currentConnected',
        'currentSearch',
        'currentEgo'
    ],
    template: `
    <div class="semantic-ego">
        <div class="top-bar">
            <i class="fas fa-times" @click="setEgo(null)"></i>
            <span>{{currentEgo ? currentEgo.name : ''}}</span>
        </div>

        <div class="contents">
            <div class="line"></div>
            <div class="ego-node-sections">
                <div class="section" 
                v-for="group in nodeGroups"
                :key="group.name"
                >
                    <div class="name"> {{group.name}} </div>
                    <div class="nodes">
                        <div class="ego-node" v-for="node in group.nodes" :key="node.id" @click="setEgo(node)">
                            {{node.name}}
                            <i class="fas fa-external-link-alt"></i>
                        </div>
                    </div>
                </div>
            </div>
            <ego-locations 
                :current-search="currentSearch"
                :nodes="locationNodes"
            ></ego-locations>
        </div>
    </div>`,
    data: function () {
        return {
            nodes: [],
            nodeGroups: [],
            relatedOntologies: [],
            locationNodes: []
        }
    },
    methods: {
        setEgo(node) {
            bus.$emit('ego-changed', node);
        }
    },
    watch: {
        currentEgo: function () {
            if (this.currentEgo) {
                this.nodes = [];
                this.nodeGroups = [];
                this.locationNodes = [];
                axios.get('/node/ego/' + this.currentEgo.id).then((res) => {
                    this.nodes = res.data;

                    axios.get('/ontology/related/' + this.currentEgo.ontology).then((res) => {
                        this.relatedOntologies = res.data;
                        if (this.currentEgo.ontology === '环境' || this.currentEgo.ontology === '物体') {
                            this.locationNodes.push(this.currentEgo);
                        }
                        for (var onto of this.relatedOntologies) {
                            if (onto === '任务') continue;
                            group = {
                                name: onto,
                                nodes: []
                            }
                            for (var node of this.nodes) {
                                if (node.ontology === onto) {
                                    if (onto === '环境' || onto === '物体') {
                                        this.locationNodes.push(node);
                                        group.nodes.push(node);
                                    } else if (onto === '历史记录') {
                                        node['name'] += ' ' + node['时间'].slice(4, 6) + '/' + node['时间'].slice(6, 8)
                                            + ' ' + node['时间'].slice(8, 10) + ':' + node['时间'].slice(10, 12);
                                        group.nodes.push(node);
                                    } else {
                                        group.nodes.push(node);
                                    }
                                }
                            }
                            if (group.nodes.length === 0) continue;
                            if (group.name === '历史记录') {
                                group.nodes.sort( (node1, node2) => {
                                    var time1 = Number.parseInt(node1['时间']);
                                    var time2 = Number.parseInt(node2['时间']);
                                    if ( time1 < time2 ) {
                                        return -1;
                                    } else if ( time1 > time2 ) {
                                        return 1;
                                    } else {
                                        return 0;
                                    }
                                })
                            }
                            this.nodeGroups.push(group);
                            console.log(this.nodeGroups);
                        }
                        this.nodeGroups.sort(function (a, b) {
                            var order = ['相关Tag', '人物', '项目', '物体', '环境', '历史记录'];
                            if (order.indexOf(a.name) < order.indexOf(b.name)) {
                                return -1;
                            } else if (order.indexOf(a.name) == order.indexOf(b.name)) {
                                return 0;
                            } else {
                                return 1;
                            }
                        })
                    })
                })
            }
        },
        currentConnected: function () {
            // axios.get('/ontology/ego?onto1=' + this.currentOntology + '&onto2=' + this.currentConnected).then((res) => {
            //     this.graphs = res.data;
            // })
        }
    }
})