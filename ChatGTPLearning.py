from openai import OpenAI
from dotenv import load_dotenv
import os
# Load environment variables from .env file
load_dotenv()
openAi_api_key = os.getenv("OPEN_AI_API_KEY")

client = OpenAI(api_key = openAi_api_key)

completion = client.chat.completions.create(
    model="gpt-4o",
    store=True,
    messages=[
        {"role": "user", "content": "write a haiku about ai"}
    ]
)

print(completion.choices[0].message.content)