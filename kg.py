from neo4j import GraphDatabase


class KGDatabase:

    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()
        
    @staticmethod
    def _get_nodes_of_ontology(tx, onto):
        query = f'MATCH (node:`{onto}`) return node\n'
        results = tx.run(query)
        return [record.data()['node'] for record in results]
    
    def get_nodes_of_ontology(self, onto):
        with self.driver.session() as session:
            results = session.read_transaction(self._get_nodes_of_ontology, onto)
        return results


    @staticmethod
    def _get_types_of_ontology(tx, onto):
        query = f'MATCH (node:`{onto}`) return node\n'
        results = tx.run(query)
        types = set()
        for record in results:
            types.add(record.data()['node']['type'])
        return list(types)
    
    def get_types_of_ontology(self, onto):
        with self.driver.session() as session:
            results = session.read_transaction(self._get_types_of_ontology, onto)
        return results


    def get_nodes_of_type(self, ntype):
        with self.driver.session() as session:
            results = session.read_transaction(self._get_nodes_of_type, ntype)
        return results
        
    @staticmethod
    def _get_nodes_of_type(tx, ntype):
        query = 'MATCH (node {type: "' + f'{ntype}' + '"}) return node\n'
        results = tx.run(query)
        return [record.data()['node'] for record in results]


    def get_related_ontologies(self, onto):
        with self.driver.session() as session:
            results = session.read_transaction(self._get_related_ontologies, onto)
        types = set()
        for record in results:
            if record.data()['LABELS(node2)'][0] not in ['任务']:
                types.add(record.data()['LABELS(node2)'][0])
        return list(types)
        
    @staticmethod
    def _get_related_ontologies(tx, onto):
        query = f'MATCH (node1:{onto}) -- (node2) return LABELS(node2)\n'
        results = tx.run(query)
        return [record for record in results]


    def get_ego_graphs(self, onto1, onto2):
        with self.driver.session() as session:
            results = session.read_transaction(self._get_ego_graphs, onto1, onto2)
        
        graphs = {}
        id2node = {}
        for record in results:
            node1 = record['node1']
            node2 = record['node2']

            if node1['id'] not in graphs:
                graphs[node1['id']] = []
                id2node[node1['id']] = node1
            
            graphs[node1['id']].append(node2)

        results = []
        for key in graphs:
            results.append({
                'center': id2node[key],
                'nodes': graphs[key]
            })
        return results
        
    @staticmethod
    def _get_ego_graphs(tx, onto1, onto2):
        query = f'MATCH (node1:{onto1}) -- (node2:{onto2}) return node1, node2\n'
        results = tx.run(query)
        return [record.data() for record in results]



    def get_ego_graph(self, nodeid):
        with self.driver.session() as session:
            results = session.read_transaction(self._get_ego_graph, nodeid)
        
        return results
        
    @staticmethod
    def _get_ego_graph(tx, nodeid):
        query = 'MATCH (n {id:' + str(nodeid) + '}) -- (node) return node\n'
        results = tx.run(query)
        return [record.data()['node'] for record in results]

    def get_nodes_with_location(self, onto):
        with self.driver.session() as session:
            results = session.read_transaction(self._get_nodes_with_location, onto)
        
        if onto in ['人物', '历史记录']:
            for record in results:
                record['node1']['x'] = record['node2']['x']
                record['node1']['y'] = record['node2']['y']
            
            return [record['node1'] for record in results]
        else:
            return results
        
    @staticmethod
    def _get_nodes_with_location(tx, onto):
        if onto in ['物体', '环境']:
            query = f'MATCH (node : {onto}) return node\n'
            results = tx.run(query)
            return [record.data()['node'] for record in results]
        elif onto in ['人物', '历史记录']:
            query = f'MATCH (node1 : {onto}) -- (node2:环境) return node1, node2\n'
            results = tx.run(query)
            return [record.data() for record in results]
        else:
            return []


    def get_task_timeline(self, task):
        with self.driver.session() as session:
            results = session.read_transaction(self._get_task_timeline, task)
        
        return results
        
    @staticmethod
    def _get_task_timeline(tx, task):
        output = []

        query = 'MATCH (n : 任务 {name: "' + task + '"}) -- (node {type:"行为步骤"}) return node\n'
        results = tx.run(query)
        nodes = [record.data()['node'] for record in results]
        if len(nodes) > 0:
            node = nodes[0]
            query = 'MATCH (node1 {id:' + str(node['id']) + '}) -[r:下一步*1..]- (node2 {type:"行为步骤"}) return node1, node2\n'
            results = tx.run(query)
            nodes = [node] + [record.data()['node2'] for record in results]

            for node in nodes:
                query = 'MATCH (node1 {id:' + str(node['id']) + '}) -- (node2) return node2\n'
                results = tx.run(query)
                related = [record.data()['node2'] for record in results]
                related = [node for node in related if node['ontology'] != '任务']
                output.append({
                    'action': node,
                    'related': related
                })
        return output;
    

    def get_node(self, name):
        with self.driver.session() as session:
            results = session.read_transaction(self._get_node, name)
        return results
        
    @staticmethod
    def _get_node(tx, name):
        query = 'MATCH (node {name: "' + f'{name}' + '"}) return node\n'
        results = tx.run(query)
        return [record.data()['node'] for record in results][0]
    

    

    