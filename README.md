# Temi WoZ UI
Knowledge graph UI code used in our CHI'21 paper "Patterns for Representing Knowledge Graphs to Communicate Situational Knowledge of Service Robots".

## Running the code

### Set up the knowledge graph
Download the neo4j graph data we have prepared from [here](). You can import the data by putting it in you database folder and running the neo4j-admin command:
```
neo4j-admin load --from=<archive-path> --database=<database> [--force]
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
