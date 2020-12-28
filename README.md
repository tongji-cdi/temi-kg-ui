# Knowledge Graph UI for the Temi robot
Knowledge graph UI code used in our CHI'21 paper "Patterns for Representing Knowledge Graphs to Communicate Situational Knowledge of Service Robots".

![A screenshot of the KG UI.](https://github.com/tongji-cdi/temi-woz-frontend/raw/master/data/frontend-photo.png)

## Running the code

### Set up the knowledge graph
Download the neo4j graph data we have prepared from [here](https://github.com/shaunabanana/temi-woz-frontend/raw/master/data/lab-kg.dump). You can import the data by putting it in you database folder and running the neo4j-admin command:
```
neo4j-admin load --from=lab-kg.dump --database=graph.db --force
```
More details can be found in the [Neo4j Docs](https://neo4j.com/docs/operations-manual/current/tools/dump-load/)


### Install python libraries
```
python -m pip install flask neo4j
```

### Start python server
```
python server.py
```

## Code Structure
* `server.py` is the main entry point of the program. It starts a Flask API for KG queries, and serves the UI code in the `static` folder.
* `kg.py` contains a class that handles the communication between Neo4j and Python. The Flask server uses this class to talk to Neo4j.
* `static` contains code for a web-based GUI built with Vue.
