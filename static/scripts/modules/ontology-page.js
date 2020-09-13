Vue.component('ontology-button', {
    props: ['name'],
    template: `
    <div 
    class="ontology-button"
    @click="changeMode(name)"
    >
        <span>{{name}}</span>
    </div>`,
    data: function () {
        return {
            ontologyMode: {
                '人物': 'semantic',
                '项目': 'semantic',
                '环境': 'semantic',
                '物体': 'semantic',
                '记录': 'episodic',
                '任务': 'procedural',
            }
        }
    },
    methods: {
        changeMode: function (name) {
            bus.$emit('change-mode', this.ontologyMode[name], name)
        }
    }
})

Vue.component('ontology-list', {
    props: ['ontologies'],
    template: `
    <div 
    class="ontology-list"
    >
        <ontology-button
        v-for="ontology in ontologies"
        :key="ontology"
        :name="ontology"
        ></ontology-button>
    </div>`
})

Vue.component('ontology-page', {
    props: ['ontologies'],
    template: `
    <div 
    class="ontology-page"
    >
        <span class="info">请选择想要查看的知识</span>
        <ontology-list
        :ontologies="ontologies"
        ></ontology-list>
    </div>`
})