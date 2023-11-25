from elasticsearch import Elasticsearch, helpers

class ElasticsearchHandler():
    def __init__(self, uri):
        try:           
            self.es = Elasticsearch([uri])
            print(self.es.info())
        except Exception as e:
            print(e)

    def create_index(self, index):
        # Elasticsearch 서버에 인덱스 생성
        INDEX_SETTINGS = {
            "settings": {
                "analysis": {
                    "filter": {
                        "my_shingle": {
                            "type": "shingle"
                        }
                    },
                    "analyzer": {
                        "my_analyzer": {
                            "type": "custom",
                            "tokenizer": "nori_tokenizer", # nori tokenizer 사용
                            "decompound_mode": "mixed",
                            "filter": ["my_shingle"]
                        }
                    },
                    # "similairty": {
                    #     "my_similarity": {
                    #         "type": "BM25" # BM25로 유사도 측정
                    #     }
                    # }
                    "similarity": {
                        "scripted_score": {
                            "type": "scripted",
                            "script": {
                                "source": ""
                            }
                        }
                    }
                }
            },

            "mappings": {
                "properties": {
                    "id": {
                        "type": "keyword",
                    },
                    "category": {
                        "type": "keyword",
                    },
                    "title": {
                        "type": "text",
                        "analyzer": "my_analyzer"
                    },
                    "title_vector": {
                        "type": "dense_vector",
                        "index": "true",
                        "similarity": "cosine",
                        "dims" : 1536
                    },
                    "dept": {
                        "type": "keyword",
                    },
                    "date": {
                        "type": "date",
                        "format": "yyyy-mm-dd"
                    },
                    "time": {
                        "type": "date",
                        "format":"HH:mm:ss",
                    },
                    "view": {
                        "type": "integer",
                    },
                    "url": {
                        "type": "keyword",
                    },
                    "page": {
                        "type": "keyword",
                    },

                }
            }
        }
        # if self.es.indices.exists(index=index):
        #     self.es.indices.delete(index=index)
        if not self.es.indices.exists(index=index):
            self.es.indices.create(index=index, body=INDEX_SETTINGS)
        print(f"Index [{index}] created")

    def insert(self, index, data):
        id = f"{data['page']}_{data['id']}" # ABCD_12345
        self.es.index(index=index, 
                 id=id,
                 body=data)
        
    def insert_bulk(self, data_list):
        helpers.bulk(self.es , data_list)
    
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

    def process_data(results):
        data = []
        for hit in results['hits']['hits']:
            data.append({
                "noticeid":hit['_id'],
                "title":hit['_source']['title'],
                "date":hit['_source']['date'],
                "url":hit['_source']['url']}
            )
        return data

    def search(self, index, body):
        return self.es.search(index, body)
    
    def select_all(self, index):
        body = {"query" : {
            "match_all" : {}
        }}
        return self.es.search(index, body)

    def search_dense(self, query, query_vector, index, topk):

        body = {
                "query": {
                    "script_score": {
                        "query": {
                            "match_phrase": {
                                "title": query
                            }
                        },
                        "script": {
                            "source": "_score + cosineSimilarity(params.query_vector, 'title_vector')",
                            "params": {"query_vector": query_vector}
                        }
                        # "source": "cosineSimilarity(params.queryVector, doc['Text_Vector1']) + cosineSimilarity(params.queryVector, doc['Text_Vector2'])  + 2.0",
                    }
                }
                }
        res = self.es.search(index=index, body=body, size=topk)
        return res
        # ids = []
        # contexts = []
        # for hit in res['hits']['hits']:
        #     ids.append(hit['_id'])
        #     contexts.append(hit['_source']['document_text'])

        # return ids, contexts # topk retrieved document id, context. sorted by score
    

