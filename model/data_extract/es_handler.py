from elasticsearch import Elasticsearch

class ElasticsearchHandler():
    def __init__(self, uri):
        try:           
            self.es = Elasticsearch([uri])
            self.es.info()
        except Exception as e:
            print(e)

    def create_index(es, index):
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
                    "similairty": {
                        "my_similarity": {
                            "type": "BM25" # BM25로 유사도 측정
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
                    },
                    "dept": {
                        "type": "keyword",
                    },
                    "date": {
                        "type": "date",
                        "format": "basic_date"
                    },
                    "time": {
                        "type": "date",
                        "format":"basic_time_no_millis",
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
        return es.indices.create(index=index, body=INDEX_SETTINGS)

    def insert(es, index, data):
        id = f"{data['page']}_{data['id']}" # ABCD_12345
        es.index(index=index, 
                 id=id,
                 body=data)
    
    def update(es, index, id, data):
        es.update()

    def search(es, query, index, topk):

        body = {
                "query": {
                    "script_score": {
                    "query": {
                        "match": {
                        "message": "elasticsearch"
                        }
                    },
                    "script": {
                        "source": "_score + cosineSimilarity(params.query_vector, 'my_dense_vector')",
                        "params": {
                        "query_vector": [4, 3.4,-0.2]
                        }
                    }
                    }
                }
                }
        res = es.search(index=index, body=body, size=topk)

        ids = []
        contexts = []
        for hit in res['hits']['hits']:
            ids.append(hit['_id'])
            contexts.append(hit['_source']['document_text'])

        return ids, contexts # topk retrieved document id, context. sorted by score
