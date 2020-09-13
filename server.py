import json
from flask import Flask, request


from kg import KGDatabase



app = Flask(__name__)
database = KGDatabase('bolt://127.0.0.1:7687', 'neo4j', 'cdi')

# print(database.get_nodes_with_location('人物'))

@app.route('/ontology/nodes/<onto>')
def get_nodes_of_ontology(onto):
    results = database.get_nodes_of_ontology(onto)
    return json.dumps(results)

@app.route('/ontology/types/<onto>')
def get_types_of_ontology(onto):
    results = database.get_types_of_ontology(onto)
    return json.dumps(results)

@app.route('/ontology/related/<onto>')
def get_related_ontologies(onto):
    results = database.get_related_ontologies(onto)
    return json.dumps(results)

@app.route('/type/nodes/<ntype>')
def get_nodes_of_type(ntype):
    results = database.get_nodes_of_type(ntype)
    return json.dumps({
        'name': ntype,
        'nodes': results
    })

@app.route('/ontology/ego')
def get_ego_graphs():
    onto1 = request.args.get('onto1', None)
    onto2 = request.args.get('onto2', None)
    results = database.get_ego_graphs(onto1, onto2)
    return json.dumps(results)

@app.route('/node/ego/<int:nodeid>')
def get_ego_graph(nodeid):
    results = database.get_ego_graph(nodeid)
    return json.dumps(results)

@app.route('/ontology/nodes/location/<onto>')
def get_nodes_with_location(onto):
    results = database.get_nodes_with_location(onto)
    return json.dumps(results)

@app.route('/task/nodes/<task>')
def get_task_timeline(task):
    results = database.get_task_timeline(task)
    return json.dumps(results)

@app.route('/node/<name>')
def get_node(name):
    results = database.get_node(name)
    return json.dumps(results)


if __name__ == '__main__':
    app.run(host='0.0.0.0')