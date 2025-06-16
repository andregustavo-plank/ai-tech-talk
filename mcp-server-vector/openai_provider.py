import openai

def generate_embedding(text: str, api_key: str, model: str = "text-embedding-ada-002") -> list:
    """Generate an embedding for the given text using OpenAI's API."""
    openai.api_key = api_key
    response = openai.Embedding.create(
        input=text,
        model=model
    )
    return response['data'][0]['embedding'] 