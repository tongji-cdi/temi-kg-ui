Vue.component('procedural-topbar', {
    props: [
    ],
    template: `
    <div 
    class="procedural-topbar"
    >
        <i class="fas fa-arrow-left" style="font-size: 4em; margin-left: 45px;"
        @click="backToOntologies()"
        ></i>
        <span class="current-onto">任务</span>
        <div class="search">
            <i class="fas fa-search" style="font-size: 2em;"
            ></i>
            <input type="text" style="font-size: 2em; background: black; color: white;"
            @change="searchTextChanged($event)">
        </div>
    </div>`,
    data: function () {
        return {
            relatedOntologies: []
        }
    },
    methods: {
        backToOntologies: function () {
            bus.$emit('change-mode', 'ontology');
        },
        searchTextChanged: function (event) {
            bus.$emit('search-changed', event.target.value);
        }
    }
})

Vue.component('task-step', {
    props: [
        'step'
    ],
    template: `
    <div 
    class="task-step"
    >
        <div class="task-step-title">{{step.action.name}}</div>
        <div class="task-step-circle"></div>
        <div class="task-step-related">
            <div class="task-step-related-wrapper" v-for="node in step.related" :key="node.id">
                <div class="task-step-related-node" @click="setEgo(node)">
                    {{node.name}}
                </div>
                <div class="task-step-node-intro" v-for="node in step.related" :key="node.id"
                v-if="step.action.name === '朗读句子'">
                    {{node.介绍文字 && step.action.name === '朗读句子' ? node.介绍文字.trim() : ''}}
                </div>
            </div>
        </div>
    </div>`,
    methods: {
        setEgo(node) {
            bus.$emit('ego-changed', node);
        }
    },
})

Vue.component('task-steps-row', {
    props: [
        'name',
        'steps',
        'currentSearch'
    ],
    template: `
    <div 
    class="nodes-row"
    >
        <span class="name">{{name}}</span>
        <div class="nodes-string">
            <task-step v-for="step in steps" :step="step" :key="step.action.id"
            v-if="currentSearch.length === 0 || step.action.name.indexOf(currentSearch) >= 0 || step.action.type.indexOf(currentSearch) >= 0"></task-step>
        </div>
    </div>`
})

Vue.component('task-node', {
    props: [
        'node'
    ],
    template: `
    <div 
    class="node"
    @click="showTask(node)"
    >
        <span>{{node.name.length >= 5 ? node.name.slice(0, 5) + '...' : node.name}}</span>
    </div>`,
    methods: {
        showTask(node) {
            bus.$emit('task-changed', node.name);
        }
    },
})

Vue.component('task-nodes-row', {
    props: [
        'name',
        'nodes',
        'currentSearch'
    ],
    template: `
    <div 
    class="nodes-row task-nodes-row"
    >
        <span class="name">{{name}}</span>
        <div class="nodes-string">
            <task-node v-for="node in nodes" :node="node" :key="node.id"
            v-if="currentSearch.length === 0 || node.name.indexOf(currentSearch) >= 0 || node.type.indexOf(currentSearch) >= 0"></task-node>
        </div>
    </div>`
})

Vue.component('procedural-page', {
    props: [
        'currentMode',
        'currentOntology',
    ],
    template: `
    <div 
    class="procedural-page"
    >
        <procedural-topbar
        v-show="!showEgo && currentTask === 'none'"
        ></procedural-topbar>

        <task-nodes-row :name="''" :current-search="currentSearch" :nodes="tasks"
        v-show="!showEgo && currentTask === 'none'"></task-nodes-row>

        <i class="fas fa-times" style="font-size: 4em; margin-left: 45px;"
        v-show="!showEgo && currentTask !== 'none'" 
        @click="changeTask('none')"
        ></i>
        <div class="timeline"
        v-show="!showEgo && currentTask !== 'none'"></div>
        <task-steps-row :name="''" :current-search="currentSearch" :steps="taskSteps"
        v-show="!showEgo && currentTask !== 'none'"></task-steps-row>

        <semantic-ego 
        :current-ontology="currentOntology" 
        :current-connected="currentConnected"
        :current-search="currentSearch"
        :current-ego="currentEgo"
        v-show="showEgo"
        ></semantic-ego>
    </div>`,
    //<!-- v-show="currentConnected === '项目' || currentConnected === '社交概念'" -->
    data: function () {
        return {
            showEgo: false,
            currentConnected: 'none',
            nodeGroups: [],
            tasks: [],
            taskSteps: [],
            currentSearch: '',
            currentEgo: null,
            currentTask: 'none'
        }
    },
    methods: {
        changeSearch: function (text) {
            this.currentSearch = text;
        },
        changeEgo: function (node) {
            this.currentEgo = node;
            if (this.currentEgo === null) {
                this.showEgo = false;
            } else {
                this.showEgo = true;
            }
        },
        changeTask: function (task) {
            this.currentTask = task;
            axios.get('/task/nodes/' + task).then( (res) => {
                console.log(res.data);
                this.taskSteps = res.data;
            } )
        }
    },
    created () {
        bus.$on('search-changed', this.changeSearch)
        bus.$on('ego-changed', this.changeEgo)
        bus.$on('task-changed', this.changeTask)

        bus.$on('command-change-search', this.changeSearch);
        bus.$on('command-change-task', this.changeTask);
        bus.$on('command-change-ego', this.changeEgo);
    },
    watch: {
        currentMode: function () {
            axios.get('/type/nodes/' + '任务').then( (res) => {
                this.tasks = res.data.nodes;
            } )
        }
    }
})