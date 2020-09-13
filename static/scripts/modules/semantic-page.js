Vue.component('semantic-topbar', {
    props: [
        'currentOntology',
        'currentConnected',
    ],
    template: `
    <div 
    class="semantic-topbar"
    >
        <i class="fas fa-arrow-left" style="font-size: 4em; margin-left: 45px;"
        @click="backToOntologies()"
        ></i>
        <span class="current-onto">{{ currentOntology }}</span>
        <div class="filters">
            <span>分组</span>
            <button v-for="ontology in relatedOntologies"
            :class="{ active: currentConnected == ontology }"
            @click="toggleConnectedKnowledge(ontology)"
            >按{{ ontology }}</button>
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
            relatedOntologies: []
        }
    },
    methods: {
        backToOntologies: function () {
            bus.$emit('change-mode', 'ontology');
        },
        toggleConnectedKnowledge: function (ontology) {
            bus.$emit('toggle-connected', ontology);
        },
        searchTextChanged: function (event) {
            bus.$emit('search-changed', event.target.value);
        }
    },
    watch: {
        currentOntology: function () {
            axios.get('/ontology/related/' + this.currentOntology).then((res3) => {
                this.relatedOntologies = res3.data;
            })
        }
    }
})

Vue.component('semantic-page', {
    props: [
        'currentOntology'
    ],
    template: `
    <div 
    class="semantic-page"
    >
        <semantic-topbar 
        :current-ontology="currentOntology"
        :current-connected="currentConnected"
        v-show="!showEgo"
        ></semantic-topbar>

        <semantic-default
        :current-ontology="currentOntology" 
        :current-connected="currentConnected"
        :current-search="currentSearch"
        v-show="!showEgo && currentConnected === 'none'"
        ></semantic-default>

        <semantic-others 
        :current-ontology="currentOntology" 
        :current-connected="currentConnected"
        :current-search="currentSearch"
        v-show="!showEgo && currentConnected !== 'none' && currentConnected !== '环境'"
        ></semantic-others>

        <semantic-locations 
        :current-ontology="currentOntology" 
        :current-connected="currentConnected"
        :current-search="currentSearch"
        v-show="!showEgo && currentConnected === '环境'"
        ></semantic-locations>

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
            allNodes: [],
            currentConnected: 'none',
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
        changeConnected: function (onto) {
            if (this.currentConnected === onto) {
                this.currentConnected = 'none';
            } else {
                this.currentConnected = onto;
            }
        },
        changeSearch: function (text) {
            console.log('changing search')
            this.currentSearch = text;
            console.log(this.currentSearch)
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
        bus.$on('toggle-connected', this.changeConnected)
        bus.$on('search-changed', this.changeSearch)
        bus.$on('ego-changed', this.changeEgo)

        bus.$on('command-change-connected',this.changeConnected);
        bus.$on('command-change-search', this.changeSearch);
        bus.$on('command-change-ego', this.changeEgo);
    }
})