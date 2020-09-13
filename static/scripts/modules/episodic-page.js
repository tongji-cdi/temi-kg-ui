Vue.component('episodic-topbar', {
    props: [
        'currentOntology',
    ],
    template: `
    <div 
    class="episodic-topbar"
    >
        <i class="fas fa-arrow-left" style="font-size: 4em; margin-left: 45px;"
        @click="backToOntologies()"
        ></i>
        <span class="current-onto">{{ currentOntology }}</span>
        <div class="filters">
            <span>筛选</span>
            <button v-for="ontology in relatedOntologies"
            >{{ ontology }}</button>
        </div>
        <div class="search">
            <i class="fas fa-search" style="font-size: 2em;"
            ></i>
            <input type="text" style="font-size: 2em; background: black; color: white;"
            @change="searchTextChanged($event)">
        </div>
    </div>`,
    data: function () {
        return {
            relatedOntologies: ['人物', '项目', '环境', '物体']
        }
    },
    methods: {
        backToOntologies: function () {
            bus.$emit('change-mode', 'ontology');
        },
        searchTextChanged: function (event) {
            bus.$emit('search-changed', event.target.value);
        }
    },
    watch: {
        currentOntology: function () {
        }
    }
})

Vue.component('episodic-page', {
    props: [
        'currentOntology'
    ],
    template: `
    <div 
    class="episodic-page"
    >
        <episodic-topbar
        :current-ontology="currentOntology"
        v-show="!showEgo"
        ></episodic-topbar>

        <semantic-ego 
        :current-ontology="currentOntology" 
        :current-connected="currentConnected"
        :current-search="currentSearch"
        :current-ego="currentEgo"
        v-show="showEgo"
        ></semantic-ego>

        <div class="timeline"></div>
    </div>`,
    //<!-- v-show="currentConnected === '项目' || currentConnected === '社交概念'" -->
    data: function () {
        return {
            showEgo: false,
            currentConnected: 'none',
            nodeGroups: [],
            allNodes: [],
            currentSearch: '',
            currentEgo: null
        }
    },
    watch: {
        currentOntology: function () {
            this.currentConnected = 'none';
            this.currentSearch = '';
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
        }
    },
    created () {
        bus.$on('search-changed', this.changeSearch)
        bus.$on('ego-changed', this.changeEgo)

        bus.$on('command-change-search', this.changeSearch);
        bus.$on('command-change-ego', this.changeEgo);
    }
})