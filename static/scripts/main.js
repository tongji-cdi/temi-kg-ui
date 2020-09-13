var app = new Vue({
    el: '#app',
    data: {
        currentMode: 'ontology',
        neo4j: neo4j.driver( 'bolt://127.0.0.1:7687', neo4j.auth.basic('neo4j', 'cdi') ),
        semantic: {
            currentOntology: '',
        },
        robotSpeech: 0
    },
    methods: {
        changeMode(mode, ontology) {
            this.currentMode = mode;
            if (mode === 'semantic') {
                this.semantic.currentOntology = ontology;
            }
        }
    },
    created () {
        bus.$on('change-mode',this.changeMode);

        bus.$on('command-change-mode',this.changeMode);
    }
})

document.querySelector('#refresh').onclick = function () {
    location.reload();
}
