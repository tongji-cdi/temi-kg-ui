const bus = new Vue({});

var serverIp = location.href.replace('http://', '').split(':')[0];
var webSocketAddress = 'ws://' + serverIp + ':1880/ws/interface';

var websocket = new WebSocket(webSocketAddress);

function startWebsocket() {
    websocket = new WebSocket(webSocketAddress);
    websocket.addEventListener('close', startWebsocket);
    websocket.addEventListener('error', startWebsocket);
    websocket.addEventListener('message', handleWebsocket);
}

function handleWebsocket(event) {
    cmd = JSON.parse(event.data);
    console.log(cmd.cmd)
    if (cmd.cmd === 'command-change-mode') {
        bus.$emit('command-change-mode', cmd.mode, cmd.ontology);
        bus.$emit('command-change-connected', 'none');
        bus.$emit('command-change-search', '');
        bus.$emit('command-change-ego', null);
    } else if (cmd.cmd === 'command-change-connected') {
        bus.$emit('command-change-connected', cmd.ontology);
        bus.$emit('command-change-search', '');
        bus.$emit('command-change-ego', null);
    } else if (cmd.cmd === 'command-change-search') {
        bus.$emit('command-change-ego', null);
        bus.$emit('command-change-search', cmd.text);
    } else if (cmd.cmd === 'command-change-ego') {
        if (cmd.name === 'null') {
            bus.$emit('command-change-ego', null);
        }
        axios.get('/node/' + cmd.name).then( (res) => {
            console.log(res.data);
            bus.$emit('command-change-mode', 'semantic', res.data.ontology);
            bus.$emit('command-change-ego', res.data);
        } )
    } else if (cmd.cmd === 'command-change-speech') {
        console.log(cmd);
        app.robotSpeech = cmd.text;
    }
}

startWebsocket();

function compareNodes(node1, node2) {
    return node1.name.localeCompare(node2.name, 'zh');
}