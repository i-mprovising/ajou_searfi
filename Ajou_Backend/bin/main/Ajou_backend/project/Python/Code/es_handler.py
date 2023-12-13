from elasticsearch import Elasticsearch, helpers

class ElasticsearchHandler():
    def __init__(self, uri, verbose=False):
        try:           
            self.es = Elasticsearch([uri])
            self.verbose = verbose
            if verbose==True:
                print(self.es.info(), "\n\n")
        except Exception as e:
            print(e)

    def create_index(self, index, delete=False):
        # Elasticsearch 서버에 인덱스 생성
        INDEX_SETTINGS = {
            "settings": {
                "analysis": {
                    "analyzer": {
                        "index_analyzer": {
                            "type": "custom",
                            "tokenizer": "nori_tokenizer", # nori tokenizer 사용
                            "decompound_mode": "mixed",
                        },
                        "lower_analyzer": {
                            "type": "custom",
                            "tokenizer": "nori_tokenizer", # nori tokenizer 사용
                            "decompound_mode": "mixed",
                            "filter": ["lowercase"]
                        }
                    }
                }

            },
            "mappings": {
                # "_doc": {
                    "properties": {
                        "num": {
                            "type": "keyword",
                            # "enabled": False
                        },
                        "category": {
                            "type": "keyword",
                            # "enabled": False,
                            "null_value": "category"
                        },
                        "title": {
                            "type": "text",
                            "analyzer": "index_analyzer",
                            "search_analyzer": "lower_analyzer"
                        },
                        "title_vector": {
                            "type": "dense_vector",
                            "index": "true",
                            "similarity": "cosine",
                            "dims" : 1536
                        },
                        "dept": {
                            "type": "keyword",
                            # "enabled": False,
                            "null_value": "공지부서"
                        },
                        "date": {
                            "type": "date",
                            # "format": "date",
                        },
                        # "time": {
                        #     "type": "date",
                        #     # "format":"HH:mm:ss",
                        #     # "enabled": False,
                        #     "null_value": "00:00:00"
                        # },
                        "view": {
                            "type": "integer",
                            # "enabled": False,
                            "null_value": 1
                        },
                        "url": {
                            "type": "keyword",
                            # "enabled": False
                        },
                        "page": {
                            "type": "keyword",
                            # "enabled": False
                        }
                    }
                # }
            }
        }

        if delete == True:
            if self.es.indices.exists(index=index):
                if self.verbose==True : 
                    print(f"* delete index : {index}\n\n")
                self.es.indices.delete(index=index)

        if not self.es.indices.exists(index=index):
            self.es.indices.create(index = index, body=INDEX_SETTINGS)
            # self.es.indices.put_mapping(index=index, body=INDEX_SETTINGS, include_type_name=True)
        print(f"Index [{index}] created")

    # insert, update
    def insert(self, index, id, data):
        # id = f"{data['page']}_{data['id']}" # ABCD_12345
        self.es.index(index=index, 
                 id=id,
                 body=data)
        
    def insert_bulk(self, data_list):
        helpers.bulk(client=self.es, actions=data_list, refresh=True)
    
    def update_id(self, index, id, data):
        body = {
            "query" : {
                "bool" : {
                "filter" : {
                    "terms" : {
                        "_id" : [id]
                    }
                }
            }
        },
            "script" : data
        }

        self.es.update_by_query(index=index, body=body)

    def process_data(self, results, score=False):

        data = []
        for hit in results['hits']['hits']:
            d = {
                "noticeid":hit['_id'],
                "title":hit['_source']['title'],
                "date":hit['_source']['date'][:10],
                "url":hit['_source']['url']}
            if score:
                d['score'] = hit['_score']
            data.append(d)
        return data

    # search
    def search(self, index, body):
        return self.es.search(index=index, body=body)
    
    def select_all(self, index):
        body = {
            "query" : {
                "match_all" : {}
            },
            "size" : 100
        }
        return self.es.search(index=index, body=body)
    
    def search_sparse(self, query, index, topk=20):
        body = {
                "explain":True,
                "query": {
                    "match": {
                        "title" : query
                    }
                },
                "size" : topk
                }
        res = self.es.search(index=index, body=body)
        return res

    def search_dense(self, query, query_vector, index, topk=20):
        body = {
                "explain":True,
                "query": {
                    "script_score": {
                        "query": {
                            "match": {
                                "title": query
                            }
                        },
                        "script": {
                            "source": "params.sparse_weight * _score + params.dense_weight * cosineSimilarity(params.query_vector, 'title_vector') + 1.0",
                            # "source": "cosineSimilarity(params.query_vector, 'title_vector') + 1.0",
                            "params": {"query_vector": query_vector,
                                       "sparse_weight": 1,
                                       "dense_weight": 1}
                        }
                        # "source": "cosineSimilarity(params.queryVector, doc['Text_Vector1']) + cosineSimilarity(params.queryVector, doc['Text_Vector2'])  + 2.0",
                    }
                },
                "size" : topk
                }
        res = self.es.search(index=index, body=body)
        return res
    