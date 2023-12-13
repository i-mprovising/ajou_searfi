from openai import OpenAI

def get_embedding(input):
    client = OpenAI()
    response = client.embeddings.create(
        input=input,
        model="text-embedding-ada-002"
    )

    return response.data[0].embedding
